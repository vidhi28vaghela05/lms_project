const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            images: [course.thumbnail]
          },
          unit_amount: course.price * 100, // cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        userId: req.user.id,
        courseId: course._id.toString()
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, courseId } = session.metadata;
    const amount = session.amount_total / 100;

    const instructorEarnings = amount * 0.7;
    const platformEarnings = amount * 0.3;

    const course = await Course.findById(courseId);

    // Create Payment Record
    const payment = await Payment.create({
      userId,
      courseId,
      amount,
      method: 'stripe',
      status: 'completed',
      transactionId: session.payment_intent,
      instructorEarnings,
      platformEarnings,
      isConfirmed: true
    });

    // Create Enrollment
    await Enrollment.create({
      studentId: userId,
      courseId
    });

    // Update Instructor Balance
    const instructor = await User.findById(course.instructorId);
    instructor.payableAmount += instructorEarnings;
    await instructor.save();
  }

  res.json({ received: true });
};

exports.submitUPIPayment = async (req, res) => {
  try {
    const { courseId, transactionId, proofImage } = req.body;
    const course = await Course.findById(courseId);
    
    const instructorEarnings = course.price * 0.7;
    const platformEarnings = course.price * 0.3;

    const payment = await Payment.create({
      userId: req.user.id,
      courseId,
      amount: course.price,
      method: 'upi',
      status: 'pending',
      transactionId,
      instructorEarnings,
      platformEarnings,
      proofImage
    });

    res.status(201).json({ message: 'UPI payment submitted. Awaiting admin confirmation.', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
