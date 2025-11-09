"use client"
import { useState } from "react"
import { useAuth } from "../../lib/auth"
import { ref, push, set } from "firebase/database"
import { database } from "../../lib/firebase"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  cart: any[]
  total: number
  onSuccess: (orderId: string) => void
  singleItem?: boolean   // ✅ new flag
}


export default function PaymentModal({ isOpen, onClose, cart, total, onSuccess ,singleItem = false,}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [loading, setLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })
  const { user } = useAuth()

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", 
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", 
    "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", 
    "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", 
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", 
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", 
    "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", 
    "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", 
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", 
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
    "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", 
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", 
    "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", 
    "Zambia", "Zimbabwe"
  ]

  const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
    "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal"
  ]

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }

    setLoading(true)

    try {
      const orderRef = push(ref(database, `orders/${user?.uid}`))
      const orderId = orderRef.key!

      const orderData = {
        id: orderId,
        userId: user?.uid,
        userEmail: user?.email,
        items: cart,
        total,
        paymentMethod,
        address,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        tracking: {
          confirmed: { status: true, timestamp: new Date().toISOString() },
          processing: { status: false, timestamp: null },
          shipped: { status: false, timestamp: null },
          delivered: { status: false, timestamp: null },
        },
      }

      await set(orderRef, orderData)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      await set(ref(database, `orders/${user?.uid}/${orderId}/tracking/processing`), {
        status: true,
        timestamp: new Date().toISOString(),
      })

      if (singleItem) {
  // ✅ Only remove this item from Firebase cart
  const itemId = cart[0]?.id
  if (itemId && user?.uid) {
    await set(ref(database, `carts/${user.uid}/${itemId}`), null) // deletes the item
  }
} else {
  // ✅ Clear entire cart
  if (user?.uid) {
    await set(ref(database, `carts/${user.uid}`), null)
  }
  localStorage.removeItem("cart")
}
window.dispatchEvent(new Event("cartUpdated"))


      onSuccess(orderId)
      onClose()
    } catch (error) {
      console.error("Payment failed:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>Complete Your Order</h2>
          <button onClick={onClose} className="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cart.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="address-section">
            <h3>Shipping Address</h3>
            <div className="address-form">
              <input
                type="text"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                required
              />
              <div className="address-row">
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
                {address.country === "India" ? (
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                  />
                )}
                <input
                  type="text"
                  placeholder="ZIP Code"
                  className="zipcode"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  required
                />
              </div>
              <select
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value, state: e.target.value === "India" ? "" : address.state })}
                required
              >
                <option value="" disabled>Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label className="payment-option">
                <input type="radio" name="payment" value="card" onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="payment-info">
                  <span className="payment-icon">💳</span>
                  <span>Credit/Debit Card</span>
                </div>
              </label>

              <label className="payment-option">
                <input type="radio" name="payment" value="paypal" onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="payment-info">
                  <span className="payment-icon">🏦</span>
                  <span>PayPal</span>
                </div>
              </label>

              <label className="payment-option">
                <input type="radio" name="payment" value="cash on delivery" onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="payment-info">
                  <span className="payment-icon">💵</span>
                  <span>Cash on Delivery</span>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="apple-pay"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-icon">📱</span>
                  <span>Apple Pay</span>
                </div>
              </label>
            </div>

            {paymentMethod === "card" && (
              <div className="card-details">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  required
                />
                <div className="card-row">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <button onClick={handlePayment} className="place-order-btn" disabled={loading || !paymentMethod}>
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Processing...
              </>
            ) : (
              `Place Order - $${total.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}