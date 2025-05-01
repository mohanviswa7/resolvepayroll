import { Button, Drawer, Radio, Space } from "antd"
import CalanderViews from "./WorkerDashboard/CalanderViews"
import { CloseOutlined } from '@ant-design/icons';
import { useSelector,useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { getImportantdates } from "store/dashboard-worker/action";


const CalendarHeader = ({ onClose, open }) => {

  const {
    importantDatesDetails,
    message,
    error,
    
  } = useSelector(state => ({
  
    importantDatesDetails: state.workerdashboardInitiationReducer.importantDatesDetails,
 
    message: state.workerdashboardInitiationReducer.message,
    error: state.workerdashboardInitiationReducer.error,
  }))
  const dispatch = useDispatch()

  useEffect(() => {

   dispatch(getImportantdates())

  }, [])




  const title = () => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Calender</p>
          <button onClick={onClose} className="me-3 bg-white border-0">
          <CloseOutlined />          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Drawer
       title={title()}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        height={600}
        width={1100}
      >
        <>
          <CalanderViews importantDatesDetails={importantDatesDetails} open={open} />
        </>
      </Drawer>
    </>
  )
}
export default CalendarHeader
