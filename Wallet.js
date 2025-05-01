import "./Wallet.scss"
import moment from "moment"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { Button, Modal } from "antd"
import { CheckCircleOutlined } from "@ant-design/icons"
import download from "assets/images/Download.svg"
import chatSymbol from "assets/images/chat symbol.svg"
import failure from "assets/images/failure.svg"
import {
  getBillingHistory,
  getCustomerDetails,
  getExceededHeadCount,
  getHeadCountPrice,
  getPaymentRenewStatus,
  getPaymentStatus,
  getSubscriptionDetails,
  postCalculatePricing,
  postConfirmPayment,
  postConfirmPaymentRenew,
  postHeadCountPrice,
  postWalletPrice,
  postSaveSaas,
  setPaymentProcessed,
  setPaymentRenewProcessed,
  getPlanStatus,
  getAuthenticationRoutes,
  getWalletBalance,
  postWalletConfirmSelection,
  getWalletSelection,
} from "store/resolveSettings/accessRightsWorkflowAndSLA/workflow/workflowProcess/workFlowLevel/action"
import { ToastMessageError, ToastMessageSuccess } from "common/messages"
import LoadingSpinner from "pages/customSpinner/CustomSpinner"
export default function Wallet({ onBack }) {
  const history = useHistory()
  const location = useLocation()
  const [headcount, setHeadcount] = useState()
  const [calculateResult, setCalculateResult] = useState(false)
  const [activeTab, setActiveTab] = useState("Monthly")
  const [customerInfo, setCustomerInfo] = useState(null)
  const [previousHeadCount, setPreviousHeadCount] = useState()
  const [loading, setLoading] = useState(false)
  const [showExceededHeadCount, setExceededHeadCount] = useState(false)
  const [isCompliance, setIsCompliance] = useState(false)
  const [isAadhar, setIsAadhar] = useState(false)
  const [isPAN, setIsPAN] = useState(false)
  const [isWhatsApp, setIsWhatsApp] = useState(false)
  const [isCommunication, setIsCommunication] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [isRenewNowModalOpen, setIsRenewNowModalOpen] = useState(false)
  const [isRenewSuccessModalOpen, setIsRenewSuccessModalOpen] = useState(false)
  const [isRenewFailModalOpen, setIsRenewFailModalOpen] = useState(false)

  //

  //
  const {
    billing_history,
    subscription_details,
    headcount_price,
    customer_details,
    payment_details,
    payment_status,
    paymentProcessed,
    pricing_details,
    renew_payment_details,
    renew_payment_status,
    renewPaymentProcessed,
    user_profile,
    wallet_balance,
    wallet_selection,
  } = useSelector(state => {
    return {
      billing_history: state.WorkflowLevel.billing_history,
      subscription_details: state.WorkflowLevel.subscription_details,
      headcount_price: state.WorkflowLevel.headcount_price,
      customer_details: state.WorkflowLevel.customer_details,
      payment_details: state.WorkflowLevel.payment_details,
      payment_status: state.WorkflowLevel.payment_status,
      paymentProcessed: state.WorkflowLevel.paymentProcessed,
      pricing_details: state.WorkflowLevel.pricing_details,
      renew_payment_details: state.WorkflowLevel.renew_payment_details,
      renew_payment_status: state.WorkflowLevel.renew_payment_status,
      renewPaymentProcessed: state.WorkflowLevel.renewPaymentProcessed,
      user_profile: state.LoginAlertReducer.user_profile,
      wallet_balance: state.WorkflowLevel.wallet_balance,
      wallet_selection: state.WorkflowLevel.wallet_selection,
    }
  })
  useEffect(() => {
    // Set the title based on the current route
    if (location.pathname === "/subscription-management") {
      document.title = "Subscription Management"
    }
  }, [location.pathname])

  useEffect(() => {
    if (wallet_selection) {
      setIsAadhar(wallet_selection.is_aadhar)
      setIsPAN(wallet_selection.is_pan)
      setIsWhatsApp(wallet_selection.is_whatsapp)
    }
  }, [wallet_selection])
console.log("wallwt",wallet_balance.remainingBalance)
  const [amounts, setAmounts] = useState({
    quarterlyAmount: 0,
    monthlyAmount: 0,
    halfYearlyAmount: 0,
    annualAmount: 0,
    quarterlyAmountWithGst: 0,
    halfYearlyAmountWithGst: 0,
    annualAmountWithGst: 0,
  })

  // const handleOk = () => {
  //     setIsModalOpen(false);
  // };
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleClose = () => {
    setIsCloseModalOpen(false)
  }

  const handleRenewNowClose = () => {
    setIsRenewNowModalOpen(false)
  }

  const handleRenewSuccess = () => {
    setIsRenewSuccessModalOpen(false)
  }

  const handleRenewFailure = () => {
    setIsRenewFailModalOpen(false)
  }

  // const [intervalId, setIntervalId] = useState(null);
  const dispatch = useDispatch()
  const formattedDate = moment(new Date()).format("YYYY-MM-DD")

  useEffect(() => {
    dispatch(getBillingHistory())
    dispatch(getSubscriptionDetails())
    dispatch(getCustomerDetails())
    //dispatch(getWalletBalance());
    dispatch(getWalletSelection())
    dispatch(getWalletBalance(formattedDate))
  }, [dispatch])

  const ExtractRemainingBalance =
    wallet_balance.length > 0 ? wallet_balance?.remainingBalance : 0

  useEffect(() => {
    if (customer_details?.payload && customer_details.payload !== "") {
      setCustomerInfo(customer_details.payload.data)
    }
  }, [customer_details])

  const billingHistoryData = billing_history?.payload?.data?.result || []

  if (billingHistoryData && billingHistoryData.length > 0) {
    billingHistoryData.sort((a, b) => {
      return (
        new Date(b.billing_date).getTime() - new Date(a.billing_date).getTime()
      )
    })
  }

  useEffect(() => {
    if (subscription_details?.payload && subscription_details.payload !== "") {
      const newHeadCount = subscription_details.payload.data.result.total_count

      // Ensure newHeadCount is a valid number
      if (newHeadCount !== undefined && newHeadCount !== null) {
        setPreviousHeadCount(newHeadCount)

        const headCountPayload = {
          HeadCount: newHeadCount,
        }

        // Ensure the payload isn't empty before dispatching
        if (Object.keys(headCountPayload).length > 0) {
          dispatch(postCalculatePricing(headCountPayload))
        }
      } else {
      }
    } else {
    }
  }, [subscription_details])

  useEffect(() => {
    if (pricing_details?.pricing !== undefined) {
      const monthlyAmount = pricing_details?.pricing
      let monthlyPrice
      if (monthlyAmount !== undefined && monthlyAmount !== null) {
        monthlyPrice = parseFloat(monthlyAmount)
      }
      if (monthlyPrice !== null && !isNaN(monthlyPrice)) {
        const gstRate = 0.18 // 18%

        const quarterlyAmount = calculateAmount(monthlyPrice * 3, 2) // Quarterly with 2% discount
        const halfYearlyAmount = calculateAmount(monthlyPrice * 6, 5) // Half-Yearly with 5% discount
        const annualAmount = calculateAmount(monthlyPrice * 12, 8) // Annually with 8% discount

        // Add GST to the amounts
        const quarterlyAmountWithGst = addGst(quarterlyAmount, gstRate)
        const halfYearlyAmountWithGst = addGst(halfYearlyAmount, gstRate)
        const annualAmountWithGst = addGst(annualAmount, gstRate)

        const calculatedAmounts = {
          monthlyAmount: monthlyPrice,
          quarterlyAmount: quarterlyAmount,
          halfYearlyAmount: halfYearlyAmount,
          annualAmount: annualAmount,
          quarterlyAmountWithGst: quarterlyAmountWithGst,
          halfYearlyAmountWithGst: halfYearlyAmountWithGst,
          annualAmountWithGst: annualAmountWithGst,
        }
        if (calculatedAmounts) {
          setAmounts(calculatedAmounts)
        }
      } else {
      }
    }
  }, [pricing_details])

  const calculateAmount = (baseAmount, discountPercent) => {
    baseAmount = parseNumber(baseAmount)
    discountPercent = parseNumber(discountPercent)

    // Debug logs to check values

    if (baseAmount === 0 || discountPercent < 0) {
      console.warn(
        "Invalid input: baseAmount or discountPercent is not appropriate."
      )
      return 0
    }

    const discountAmount = (baseAmount * discountPercent) / 100

    const finalAmount = baseAmount - discountAmount

    return finalAmount
  }

  // Helper function to safely parse a value to a number
  const parseNumber = value => {
    const number = parseFloat(value)
    return isNaN(number) ? 0 : number
  }

  function addGst(amount, gstRate) {
    return amount * gstRate
  }

  const totalAmount = () => {
    if (activeTab == "Monthly") {
      return (
        amounts.monthlyAmount + addGst(amounts.monthlyAmount, 0.18)
      ).toFixed(2)
    } else if (activeTab == "Quarterly") {
      return (
        amounts.quarterlyAmount + addGst(amounts.quarterlyAmount, 0.18)
      ).toFixed(2)
    } else if (activeTab == "Half-Yearly") {
      return (
        amounts.halfYearlyAmount + addGst(amounts.halfYearlyAmount, 0.18)
      ).toFixed(2)
    } else if (activeTab == "Annually") {
      return (
        amounts.annualAmount + addGst(amounts.annualAmount, 0.18)
      ).toFixed(2)
    }
    return "0.00" // Default value if no tab is selected
  }

  const formatNumber = number => {
    const num = parseFloat(number)
    if (isNaN(num)) return "0.00" // Return a default value if the input is not a number

    // Convert number to string and split into integer and decimal parts
    let [integerPart, decimalPart] = num.toFixed(2).split(".")

    // Add commas to the integer part
    let lastThreeDigits = integerPart.slice(-3)
    let otherDigits = integerPart.slice(0, -3)

    if (otherDigits !== "") {
      lastThreeDigits = "," + lastThreeDigits
    }

    integerPart =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits

    // Combine integer part and decimal part
    return `${integerPart}.${decimalPart}`
  }

  const handleHeadcountChange = event => {
    setHeadcount(event.target.value)
  }

  const calculatePricing = () => {
    dispatch(getHeadCountPrice(headcount))
    ToastMessageSuccess("Calculated pricing successfully", true)
    setCalculateResult(true)
  }
  const handleSelection = () => {
    const payload = {
      is_pan: isPAN,
      is_aadhar: isAadhar,
      is_whatsapp: isWhatsApp,
    }

    dispatch(postWalletConfirmSelection(payload))
  }
  const makePayment = () => {
    const payload = {
      customer_details: {
        customer_phone: customerInfo?.mobile_no,
        customer_email: customerInfo?.email,
        customer_name: customerInfo?.first_name,
      },
      link_notify: {
        send_sms: false,
        send_email: false,
      },
      link_id: "",
      //  link_amount: headcount_price?.data?.monthlyRate,
      link_amount: headcount, //((headcount_price?.data?.monthlyRate) ) * ((headcount_price?.data?.monthsRemaining) ),
      link_currency: "INR",
      link_purpose: "subscribe",
    }
    setLoading(true)
    dispatch(postConfirmPayment(payload))
  }

  useEffect(() => {
    let intervalId
    if (!paymentProcessed && payment_details?.link_url) {
      window.open(payment_details.link_url, "_blank")
      if (payment_details?.link_id) {
        const checkPaymentStatus = () => {
          dispatch(getPaymentStatus(payment_details?.link_id))
        }
        intervalId = setInterval(checkPaymentStatus, 10000)
        if (
          payment_status?.link_status == "PAID" ||
          payment_status?.link_status == "FAILED"
        ) {
          if (intervalId) {
            clearInterval(intervalId)
            // intervalId = null; // Ensure interval is cleared
          }
          setLoading(false)
        }
        if (payment_status?.link_status == "PAID") {
          if (payment_status.link_url) {
            payment_status.link_url = ""
          }
          setIsModalOpen(true)
          const payload = {
            OrgId: null,
            BillingCycle: "",
            Amount: headcount, //headcount_price?.data?.monthlyRate ? headcount_price?.data?.monthlyRate.toString() : "0",
            Response: payment_status,
            LinkId: payment_status?.link_id,
            // taxableCount: generalDetails?.taxableEmployees || 0,
            // nontaxablecount: generalDetails?.nonTaxableEmployees || 0,
            previousCount:
              subscription_details?.payload?.data?.result?.total_count,
            additionalCount: headcount,
            // PAN: {
            //     isSelected: isPAN,
            //     amount: isPAN ? 30 : 0
            // },
            // Aadhar: {
            //     isSelected: isAadhar,
            //     amount: isAadhar ? 50 : 0
            // },
            // WhatsApp: {
            //     isSelected: isWhatsApp,
            //     amount: isWhatsApp ? 50 : 0
            // },
          }
          dispatch(setPaymentProcessed(true))
          dispatch(postWalletPrice(payload))
        }
        if (payment_status?.link_status == "FAILED") {
          setIsCloseModalOpen(true)
          dispatch(setPaymentProcessed(true))
        }
        return () => {
          if (intervalId) {
            clearInterval(intervalId)
          }
        }
      }
    }
  }, [payment_details, payment_status])

  const renewNow = () => {
    setIsRenewNowModalOpen(true)
  }

  const handleRenewHeadCountChange = event => {
    setPreviousHeadCount(event.target.value)
  }

  const calculateRenewPricing = () => {
    const headCountPayload = {
      HeadCount: previousHeadCount,
    }

    // Ensure the payload isn't empty before dispatching
    if (Object.keys(headCountPayload).length > 0) {
      if (previousHeadCount < 500) {
        setExceededHeadCount(false)
        dispatch(postCalculatePricing(headCountPayload))
        ToastMessageSuccess("Calculated pricing successfully", true)
      } else {
        setExceededHeadCount(true)
        dispatch(getExceededHeadCount())
        ToastMessageError(
          "Head count is exceeded, Please contact support",
          true
        )
      }
    }
  }

  const renewSubscriptionPayment = () => {
    const payload = {
      customer_details: {
        customer_phone: customerInfo?.mobile_no,
        customer_email: customerInfo?.email,
        customer_name: customerInfo?.first_name,
      },
      link_notify: {
        send_sms: false,
        send_email: false,
      },
      link_id: "",
      link_amount: parseFloat(totalAmount()),
      link_currency: "INR",
      link_purpose: "subscribe",
    }
    setLoading(true)
    dispatch(postConfirmPaymentRenew(payload))

    if (localStorage.getItem("token")) {
      dispatch(getPlanStatus())
    }
  }

  useEffect(() => {
    let intervalId

    if (!renewPaymentProcessed && renew_payment_details?.link_url) {
      window.open(renew_payment_details.link_url, "_blank")
      if (renew_payment_details?.link_id) {
        const checkPaymentStatus = () => {
          dispatch(getPaymentRenewStatus(renew_payment_details?.link_id))
        }
        intervalId = setInterval(checkPaymentStatus, 10000)
        if (
          renew_payment_status?.link_status == "PAID" ||
          renew_payment_status?.link_status == "FAILED"
        ) {
          if (intervalId) {
            clearInterval(intervalId)
            // intervalId = null; // Ensure interval is cleared
          }
          setLoading(false)
        }
        if (renew_payment_status?.link_status == "PAID") {
          if (renew_payment_status.link_url) {
            renew_payment_status.link_url = ""
          }
          setIsRenewNowModalOpen(false)
          setIsRenewSuccessModalOpen(true)
          dispatch(setPaymentRenewProcessed(true))
          const payload = {
            OrgId: null,
            BillingCycle: activeTab,
            Amount: headCount, //parseFloat(totalAmount()) ? parseFloat(totalAmount()).toString() : "0",
            Response: renew_payment_status,
            LinkId: renew_payment_status?.link_id,
            taxableCount: previousHeadCount.toString() || "0",
            nontaxablecount: "0",
          }
          dispatch(postSaveSaas(payload))
          dispatch(getAuthenticationRoutes())
        }
        if (renew_payment_status?.link_status == "FAILED") {
          setIsRenewNowModalOpen(false)
          setIsRenewFailModalOpen(true)
          dispatch(setPaymentRenewProcessed(true))
        }
        return () => {
          if (intervalId) {
            clearInterval(intervalId)
          }
        }
      }
    }
  }, [renew_payment_details, renew_payment_status])

  const handleTabClick = tabName => {
    setActiveTab(tabName)
  }

  const getFontWeight = tabName => {
    return activeTab === tabName ? "bold" : "normal"
  }

  const downloadInvoice = (base64String, billing_date) => {
    try {
      // Decode the Base64 string
      const byteCharacters = atob(base64String)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)

      // Create a Blob from the byte array
      const blob = new Blob([byteArray], { type: "application/pdf" })

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${user_profile.organization_name}_${billing_date}.pdf` // Specify the file name
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading the PDF:", error)
    }
  }

  return (
    <div className="ml-4 subscription-management-container">
      {/* Success Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        closable={true}
        maskClosable={false}
        className="payment-success-modal"
      >
        <div className="modal-content text-center p-5">
          <CheckCircleOutlined className="success-icon text-green-500 text-6xl mb-4" />
          <div className="font-pop-36 fw-700 text-gray-800">
            Payment Successful
          </div>
          <div className="font-pop-16 text-gray-600 mt-2 mb-6">
            Thank you for subscribing to our service
          </div>

          <div className="subscription-details bg-gray-50 rounded-lg p-4 text-left">
            <div className="font-pop-22 fw-700 text-gray-800 mb-3 flex items-center">
              <i className="fas fa-receipt mr-2"></i>
              Subscription Details
            </div>
            <div className="detail-item flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="fw-700 text-gray-800">₹{headcount}</span>
            </div>
          </div>

          <div className="modal-footer mt-6">
            <button
              type="button"
              className="btn-primary flex items-center justify-center"
              onClick={() => {
                setIsModalOpen(false)
                history.push("/company-setup-for-customer")
              }}
            >
              Continue <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </Modal>

      {/* Failure Modal */}
      <Modal
        title={null}
        open={isCloseModalOpen}
        footer={null}
        onCancel={handleClose}
        closable={true}
        maskClosable={false}
        className="payment-failure-modal"
      >
        <div className="modal-content text-center p-5">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="font-pop-36 fw-700 text-gray-800">Payment Failed</div>
          <div className="font-pop-16 text-gray-600 mt-2 mb-6">
            We couldn't process your payment. Please try again.
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-primary flex items-center justify-center"
              onClick={() => setIsCloseModalOpen(false)}
            >
              <i className="fas fa-sync-alt mr-2"></i> Try Again or Contact
              Support
            </button>
          </div>
        </div>
      </Modal>

      {/* Renew Now Modal */}
      <Modal
        title={null}
        open={isRenewNowModalOpen}
        footer={null}
        onCancel={handleRenewNowClose}
        closable={true}
        maskClosable={false}
        className="renewal-modal"
        width={680}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-pop-20 fw-700 text-gray-800 flex items-center">
              <i className="fas fa-file-invoice-dollar mr-2"></i>
              Pricing Summary
            </h2>
          </div>

          {showExceededHeadCount ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start mb-4">
                <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                <div>
                  <p className="font-pop-14 mb-3">
                    Dear {customerInfo?.first_name},
                  </p>
                  <p className="font-pop-14 mb-3">
                    We understand that managing a large enterprise comes with
                    complex challenges. Your organization's needs require
                    tailored solutions.
                  </p>
                  <p className="font-pop-14 mb-3">
                    Our team is ready to discuss custom solutions for your
                    requirements.
                  </p>
                  <p className="font-pop-14 mb-3">
                    Would you be available for a brief call?
                  </p>
                  <p className="font-pop-14">Best regards,</p>
                  <p className="font-pop-14">Resolvepay Team</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 mr-4">
                  <label className="block font-pop-14 text-gray-600 mb-2">
                    <i className="fas fa-users mr-2"></i>
                    Number of Headcount
                  </label>
                  <input
                    type="text"
                    className="form-control w-full"
                    value={previousHeadCount}
                    onChange={handleRenewHeadCountChange}
                  />
                </div>
                <button
                  type="button"
                  className="btn-secondary self-end flex items-center"
                  onClick={calculateRenewPricing}
                >
                  <i className="fas fa-calculator mr-2"></i> Calculate Price
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-pop-16 fw-600 text-blue-600">
                    <i className="fas fa-cube mr-2"></i>
                    Basic Subscription
                  </h3>
                  <span className="badge bg-blue-100 text-blue-800">
                    Popular
                  </span>
                </div>

                <div className="subscription-tabs mb-4">
                  <div className="flex border-b border-gray-200">
                    {["Monthly", "Quarterly", "Half-Yearly", "Annually"].map(
                      tab => (
                        <button
                          key={tab}
                          className={`tab-button ${
                            activeTab === tab ? "active" : ""
                          }`}
                          onClick={() => handleTabClick(tab)}
                        >
                          {tab}
                          {tab === "Quarterly" && (
                            <span className="discount-badge">2% OFF</span>
                          )}
                          {tab === "Half-Yearly" && (
                            <span className="discount-badge">5% OFF</span>
                          )}
                          {tab === "Annually" && (
                            <span className="discount-badge">8% OFF</span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="price-display grid grid-cols-4 gap-4 mb-6">
                  <div
                    className={`price-option ${
                      activeTab === "Monthly" ? "active" : ""
                    }`}
                  >
                    <div className="price-amount">
                      ₹
                      {formatNumber(
                        Math.round(amounts.monthlyAmount).toFixed(2)
                      )}
                    </div>
                    <div className="price-label">Monthly</div>
                  </div>
                  <div
                    className={`price-option ${
                      activeTab === "Quarterly" ? "active" : ""
                    }`}
                  >
                    <div className="price-amount">
                      ₹
                      {formatNumber(
                        Math.round(amounts.quarterlyAmount).toFixed(2)
                      )}
                    </div>
                    <div className="price-label">Quarterly</div>
                  </div>
                  <div
                    className={`price-option ${
                      activeTab === "Half-Yearly" ? "active" : ""
                    }`}
                  >
                    <div className="price-amount">
                      ₹
                      {formatNumber(
                        Math.round(amounts.halfYearlyAmount).toFixed(2)
                      )}
                    </div>
                    <div className="price-label">Half-Yearly</div>
                  </div>
                  <div
                    className={`price-option ${
                      activeTab === "Annually" ? "active" : ""
                    }`}
                  >
                    <div className="price-amount">
                      ₹
                      {formatNumber(
                        Math.round(amounts.annualAmount).toFixed(2)
                      )}
                    </div>
                    <div className="price-label">Annually</div>
                  </div>
                </div>

                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>Base Pricing</span>
                    <span>
                      {activeTab === "Monthly" &&
                        `₹${formatNumber(
                          Math.round(amounts.monthlyAmount).toFixed(2)
                        )}`}
                      {activeTab === "Quarterly" &&
                        `₹${formatNumber(
                          Math.round(amounts.quarterlyAmount).toFixed(2)
                        )}`}
                      {activeTab === "Half-Yearly" &&
                        `₹${formatNumber(
                          Math.round(amounts.halfYearlyAmount).toFixed(2)
                        )}`}
                      {activeTab === "Annually" &&
                        `₹${formatNumber(
                          Math.round(amounts.annualAmount).toFixed(2)
                        )}`}
                    </span>
                  </div>
                  <div className="breakdown-row">
                    <span>GST 18%</span>
                    <span>
                      {activeTab === "Monthly" &&
                        `₹${formatNumber(addGst(amounts.monthlyAmount, 0.18))}`}
                      {activeTab === "Quarterly" &&
                        `₹${formatNumber(
                          addGst(amounts.quarterlyAmount, 0.18)
                        )}`}
                      {activeTab === "Half-Yearly" &&
                        `₹${formatNumber(
                          addGst(amounts.halfYearlyAmount, 0.18)
                        )}`}
                      {activeTab === "Annually" &&
                        `₹${formatNumber(addGst(amounts.annualAmount, 0.18))}`}
                    </span>
                  </div>
                  <div className="breakdown-row total">
                    <span>Total Amount</span>
                    <span className="font-bold">
                      ₹{formatNumber(totalAmount())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn-primary-lg"
                  onClick={renewSubscriptionPayment}
                >
                  <i className="fas fa-credit-card mr-2"></i> Make Payment
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Renew Success Modal */}
      <Modal
        title={null}
        open={isRenewSuccessModalOpen}
        footer={null}
        onCancel={handleRenewSuccess}
        closable={true}
        maskClosable={false}
        className="payment-success-modal"
      >
        <div className="modal-content text-center p-5">
          <CheckCircleOutlined className="success-icon text-green-500 text-6xl mb-4" />
          <div className="font-pop-36 fw-700 text-gray-800">
            Renewal Successful
          </div>
          <div className="font-pop-16 text-gray-600 mt-2 mb-6">
            Your subscription has been renewed successfully
          </div>

          <div className="subscription-details bg-gray-50 rounded-lg p-4 text-left">
            <div className="font-pop-22 fw-700 text-gray-800 mb-3 flex items-center">
              <i className="fas fa-receipt mr-2"></i>
              Subscription Details
            </div>
            <div className="detail-item flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subscription Period:</span>
              <span className="fw-600 text-gray-800">{activeTab}</span>
            </div>
            <div className="detail-item flex justify-between py-2">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="fw-700 text-gray-800">₹{headcount}</span>
            </div>
          </div>

          <div className="modal-footer mt-6">
            <button
              type="button"
              className="btn-primary flex items-center justify-center"
              onClick={() => {
                setIsRenewSuccessModalOpen(false)
                history.push("/company-setup-for-customer")
              }}
            >
              Continue <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </Modal>

      {/* Renew Fail Modal */}
      <Modal
        title={null}
        open={isRenewFailModalOpen}
        footer={null}
        onCancel={handleRenewFailure}
        closable={true}
        maskClosable={false}
        className="payment-failure-modal"
      >
        <div className="modal-content text-center p-5">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="font-pop-36 fw-700 text-gray-800">Renewal Failed</div>
          <div className="font-pop-16 text-gray-600 mt-2 mb-6">
            We couldn't process your renewal. Please try again.
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-primary flex items-center justify-center"
              onClick={() => setIsRenewFailModalOpen(false)}
            >
              <i className="fas fa-sync-alt mr-2"></i> Try Again or Contact
              Support
            </button>
          </div>
        </div>
      </Modal>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner">
              <i className="fas fa-circle-notch fa-spin"></i>
            </div>
            <div className="loading-text">
              Processing your payment. Do not close or refresh your page...
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="subscription-header">
        <div>
          <h1 className="flex items-center">
            <i className="fas fa-wallet mr-3"></i>
            Wallet Management
          </h1>
          <p className="subtitle">
            Unlock prepaid benefits of our product and manage your KYC and
            WhatsApp subscriptions
          </p>
        </div>
      </div>

      <div className="subscription-cards-container">
        <div className="benefits-card">
          {/* <div className="card-header">
        <i className="fas fa-star mr-2"></i> Service Pricing
    </div>
    
    <table className="features-table w-full">
        <thead>
            <tr className="border-b border-gray-200"> 
                <th className="text-left pb-2">Service</th>
                <th className="text-right pb-2">Rate</th>
            </tr>
        </thead>
        <tbody>
            <tr className="border-b border-gray-100">
                <td className="py-3">
                    <div className="flex items-center">
                        <i className="fas fa-id-card mr-3 text-blue-500 text-lg"></i>
                        <div>
                            <div className="font-medium">KYC Verification</div>
                            <div className="text-xs text-gray-500">Identity verification</div>
                        </div>
                    </div>
                </td>
                <td className="py-3 text-right">
                    <div className="font-bold">₹10.00</div>
                    <div className="text-xs text-gray-500">per verification</div>
                </td>
            </tr>
            <tr>
                <td className="py-3">
                    <div className="flex items-center">
                        <i className="fab fa-whatsapp mr-3 text-green-500 text-lg"></i>
                        <div>
                            <div className="font-medium">WhatsApp Messaging</div>
                            <div className="text-xs text-gray-500">Business communication</div>
                        </div>
                    </div>
                </td>
                <td className="py-3 text-right">
                    <div className="font-bold">₹0.25</div>
                    <div className="text-xs text-gray-500">per message</div>
                </td>
            </tr>
        </tbody>
    </table> */}
          {/* // */}
          <div className="ps-2">
            {/* Service Pricing Card */}
            <div className="card-header mb-3">
 {/* // const ExtractRemainingBalance = */}
  Wallet Balance as on date:₹{wallet_balance.remainingBalance>0  ? wallet_balance?.remainingBalance:0}
  {/* {wallet_balance.length > 0 ? wallet_balance?.remainingBalance : 0} */}
   {/* ₹{wallet_balance.remainingBalance} */}
            </div>
            <div className="card-header mb-3">
              <i className="fas fa-star mr-2"></i> Service Pricing
            </div>

            {/* KYC Verification Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center font-pop-14 dark fw-600 mb-2">
                <span>KYC Verification</span>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input custom-switch"
                    type="checkbox"
                    role="switch"
                    id="kycSwitch"
                    checked={
                      isCompliance ||
                      wallet_selection.is_aadhar ||
                      wallet_selection.is_pan
                    }
                    onChange={() => setIsCompliance(!isCompliance)}
                    readOnly
                  />
                </div>
              </div>

              {(isCompliance ||
                wallet_selection.is_aadhar ||
                wallet_selection.is_pan) && (
                <div className="table-responsive">
                  <table
                    className="table table-borderless mb-4"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <colgroup>
                      <col style={{ width: "50%" }} />
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "20%" }} />
                    </colgroup>
                    <thead>
                      <tr className="font-pop-12 fw-600">
                        <th className="ps-0">KYC Type</th>
                        <th className="text-end">Price</th>
                        <th className="text-center pe-0">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className=" py-2 align-middle py-2">
                          <label className="font-pop-12">Aadhar</label>
                        </td>
                        <td className="text-end align-middle py-2">
                          <span className="font-pop-12">₹10/user</span>
                        </td>
                        <td className="text-center align-middle py-2 ">
                          <input
                            type="checkbox"
                            name="Aadhar"
                            checked={isAadhar}
                            onChange={() => setIsAadhar(!isAadhar)}
                            style={{
                              width: "1.2rem",
                              height: "1.2rem",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>

                      {/* PAN Checkbox */}
                      <tr>
                        <td className=" py-2 align-middle py-2">
                          <label className="font-pop-12">PAN</label>
                        </td>
                        <td className="text-end align-middle py-2">
                          <span className="font-pop-12">₹10/user</span>
                        </td>
                        <td className="text-center align-middle py-2 ">
                          <input
                            type="checkbox"
                            className=""
                            name="PAN"
                            checked={isPAN}
                            onChange={() => setIsPAN(!isPAN)} // Toggle isPAN on change
                            style={{
                              width: "1.2rem",
                              height: "1.2rem",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Communications Section */}
            <div>
              <div className="d-flex justify-content-between align-items-center font-pop-14 dark fw-600 mb-2">
                <span>Business Communication</span>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input custom-switch"
                    type="checkbox"
                    role="switch"
                    id="kycSwitch"
                    checked={isCommunication || wallet_selection.is_whatsapp}
                    onChange={() => setIsCommunication(!isCommunication)}
                    readOnly
                  />
                </div>
              </div>

              {(isCommunication || wallet_selection.is_whatsapp) && (
                <div className="table-responsive">
                  <table
                    className="table table-borderless mb-4"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <colgroup>
                      <col style={{ width: "50%" }} />
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "20%" }} />
                    </colgroup>
                    <thead>
                      <tr className="font-pop-12 fw-600">
                        <th className="ps-0">Communication Type</th>
                        <th className="text-end">Price</th>
                        <th className="text-center pe-0">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
          <td className="ps-0 align-middle py-2">
            <label className="font-pop-12">WhatsApp</label>
          </td>
          <td className="text-end align-middle py-2">
            <span className="font-pop-12">₹50</span>
          </td>
          <td className="text-center pe-0 align-middle py-2 d-flex justify-content-center">
            <input
              type="checkbox"
              className=""
              name="WhatsApp"
              checked={isWhatsApp}
              onChange={() => setIsWhatsApp(!isWhatsApp)}  // Toggle isWhatsApp on change
              style={{
                width: '1.2rem',
                height: '1.2rem',
                cursor: 'pointer'
              }}
            />
          </td>
        </tr> */}
                      <tr>
                        <td className=" py-2 align-middle py-2">
                          <label className="font-pop-12">WhatsApp</label>
                        </td>
                        <td className="text-end align-middle py-2">
                          <span className="font-pop-12">₹0.25/message</span>
                        </td>
                        <td className="text-center align-middle py-2 ">
                          <input
                            type="checkbox"
                            className=""
                            name="WhatsApp"
                            checked={isWhatsApp}
                            onChange={() => setIsWhatsApp(!isWhatsApp)} // Toggle isWhatsApp on change
                            style={{
                              width: "1.2rem",
                              height: "1.2rem",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* Add this at the bottom of your component, after all the sections */}
            {(isAadhar || isPAN || isWhatsApp) && (
              <div className="mt-4 text-start">
                {" "}
                {/* Changed from 'text-end' to 'text-start' */}
                <button className="btn btn-primary" onClick={handleSelection}>
                  Confirm Selection
                </button>
              </div>
            )}
          </div>
          {/* // */}
        </div>

        <div className="recharge-card">
          <div className="card-header">
            <i className="fas fa-credit-card mr-2"></i> Recharge
          </div>

          <div className="recharge-form">
            <div className="form-group">
              <label>
                <i className="fas fa-indian-rupee-sign mr-2"></i>
                Enter Amount (₹)
              </label>
              <div className="input-group">
                <input
                  type="text"
                  name="link_amount"
                  className="form-control"
                  value={headcount}
                  onChange={handleHeadcountChange}
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-primary btn-block"
              onClick={makePayment}
            >
              <i className="fas fa-lock mr-2"></i> Make Payment
            </button>
            <div className="text-center text-xs text-gray-500 mt-2">
              <span style={{ color: "red", fontWeight: "bold" }}>
                Wallet Instruction *
              </span>
              <br />
              Customers who opt for either KYC and / or Whatsapp feature would
              need to pay a lumpsum amount in to the wallet to have credits. As
              & when you utilise the credits, you would be able to view the
              utilised credits and balance in the wallet. Please load your
              wallet based on your expected usage.
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              <i className="fas fa-shield-alt mr-1 text-blue-400"></i>
              Secure 256-bit encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
