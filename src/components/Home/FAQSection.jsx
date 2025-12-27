import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDownOutline, IoHelpCircleOutline } from "react-icons/io5";

const FAQSection = () => {
  // কোন প্রশ্নটি খোলা আছে তা ট্র্যাক করার জন্য স্টেট
  const [activeIdx, setActiveIdx] = useState(0);

  const faqs = [
    {
      question: "How do I place an order on FreshNess?",
      answer: "Ordering at FreshNess is simple! Browse our categories, add your desired organic products to the cart, and proceed to checkout. You will need to provide your delivery address and choose a payment method. Once confirmed, you'll receive an order ID and real-time updates via SMS and email until your fresh groceries reach your doorstep."
    },
    {
      question: "What is your return and refund policy?",
      answer: "We take pride in our quality, but if you receive a damaged or unsatisfactory product, you can report it within 24 hours of delivery. Our team will verify the issue and initiate a full refund or a replacement immediately. Customer satisfaction is our top priority, and we ensure a hassle-free return process for all our users."
    },
    {
      question: "Are your products truly 100% organic?",
      answer: "Yes, absolutely! We source our products directly from certified organic farms that follow natural cultivation methods without harmful pesticides or synthetic fertilizers. Each batch undergoes a strict quality check to ensure that you and your family receive only the healthiest and most natural food items available in the market."
    },
    {
      question: "How long does delivery usually take?",
      answer: "We offer same-day delivery for orders placed before 12:00 PM in selected areas. Standard delivery usually takes between 12 to 24 hours. Our dedicated delivery team works tirelessly to ensure that your vegetables and fruits remain farm-fresh during transit, using specialized temperature-controlled packaging where necessary."
    },
    {
      question: "Do you offer any discounts for regular customers?",
      answer: "We love our loyal customers! FreshNess offers a 'Weekly Discount' program and a loyalty points system. For every purchase, you earn points that can be redeemed for future discounts. Additionally, subscribers to our newsletter receive exclusive early access to flash sales and seasonal organic food festivals."
    },
    {
      question: "What payment methods do you accept?",
      answer: "To make your shopping experience convenient, we accept a wide range of payment options including Credit/Debit Cards (Visa, MasterCard), Mobile Banking (bKash, Nagad), and Cash on Delivery (COD). All online transactions are processed through a secure 128-bit encrypted gateway to ensure your financial data is 100% safe."
    },
    {
      question: "Can I track my order in real-time?",
      answer: "Yes, you can! Once your order is dispatched, you will receive a tracking link via SMS. You can also log in to your FreshNess account and go to 'My Orders' to see the exact location of our delivery partner. This ensures you know exactly when to expect your fresh groceries at your home."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIdx(activeIdx === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-green-600 font-bold uppercase tracking-widest text-sm mb-3"
          >
            <IoHelpCircleOutline size={20} />
            <span>Any Questions?</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Frequently Asked <span className="text-green-600">Questions</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about our organic products, delivery process, and policies. If you can't find your answer here, feel free to contact our support team.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                activeIdx === index ? "border-green-500 bg-white shadow-xl" : "border-gray-200 bg-white hover:border-green-300"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors ${
                  activeIdx === index ? "text-green-600" : "text-gray-800"
                }`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIdx === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 rounded-full ${activeIdx === index ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  <IoChevronDownOutline size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIdx === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed text-base md:text-lg border-t border-gray-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom Contact CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 text-center p-8 bg-indigo-900 rounded-3xl text-white shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="opacity-80 mb-6">Can't find the answer you're looking for? Please chat with our friendly team.</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
            Contact Support
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default FAQSection;