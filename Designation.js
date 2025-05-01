import React, { useState } from "react"
import AvForm from "availity-reactstrap-validation/lib/AvForm"
import AvField from "components/Common/CustomAvField"
import {
  Button,
  Col,
  Row,
  Table,
  Card,
  CardBody,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import {
  createDesignation,
  getDesignation,
  updateDesignation,
  deleteDesignation,
} from "../../store/designation/action"

const Designation = props => {
  const { designation } = useSelector(state => ({
    designation: state.organizationDesignation.allDesignation,
  }))
  const dispatch = useDispatch()
  // Modal open state
  const [modal, setModal] = React.useState(false)
  const [state, setState] = useState({ id: 0, name: "" })
  // Toggle for Modal
  const toggle = item => setModal(!modal)
  const updateData = async (e, v) => {
    v["type"] = "Designation"
    v["is_active"] = "1"
    
    dispatch(updateDesignation(v, state.id.toString()))
    dispatch(getDesignation())
    toggle()
  }
  const onDelete = id => {
    
    dispatch(deleteDesignation(id))
    dispatch(getDesignation())
  }
  return (
    <div>
      <Card>
        <CardBody>
          <AvForm
            className="form-horizontal"
            onValidSubmit={(e, v) => {
              dispatch(createDesignation(v, props.history))
              dispatch(getDesignation())
              
            }}
          >
            <Row lg="12">
              <Col lg="6">
                <div className="invisible">
                  <AvField
                    name="type"
                    label="Type"
                    value="Designation"
                    className="form-control"
                    type="text"
                    readOnly={true}
                    style={{ display: "none" }}
                  />
                </div>
                {/* <div className="mb-3">
                            <AvField 
                                name="skill_level_id"
                                label="Skill Level ID"
                                value="1"
                                className="form-control"
                                type="text"
                                required
                             />
                        </div> */}
                <div className="mb-3">
                  <AvField
                    name="name"
                    label="Name"
                    value=""
                    className="form-control"
                    type="text"
                    required
                  />
                </div>
                <div className="mb-3">
                  <AvField
                    type={"textarea"}
                    name="description"
                    label="Description"
                    rows="5"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="2">
                <div className="mt-3 d-grid">
                  <button className="btn btn-primary btn-block" type="submit">
                    Add
                  </button>
                </div>
              </Col>
            </Row>
          </AvForm>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="table-responsive">
            <Table className="table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {designation.map((item, idx) => (
                  <tr key={`key-${idx.toString()}`} value={item.id}>
                    <td>
                      <h6>{item.id}</h6>
                    </td>
                    <td>
                      <h6>{item.name}</h6>
                    </td>
                    <td ><div className="d-flex gap-3">
                      <i className="fas fa-pencil-alt text-success "
                        onClick={() => {
                          setState({ id: item.id, name: item.name })
                          toggle(item.name)
                        }}
                      />
                       <i className="fas fa-trash-alt me-1 text-danger" onClick={() => onDelete(item.id)}/>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
      {/* {renderDesignation.map((item)=>{item.name})}
        {
      {/* {designation.map(({item,index}) =>(
            
            <div key={index}>
                {item}
            </div>
        ))} */}
      <div>
        <Modal isOpen={modal} toggle={toggle} modalTransition={{ timeout: 20 }}>
          <AvForm onValidSubmit={(e, v) => updateData(e, v)}>
            {" "}
            <ModalBody>
              <div className="mb-3">
                <AvField
                  name="name"
                  label="Name"
                  value={state.name}
                  className="form-control"
                  type="text"
                  required
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type={"submit"}>
                Update
              </Button>
            </ModalFooter>
          </AvForm>
        </Modal>
      </div>
    </div>
  )
}

Designation.propTypes = {
  designation: PropTypes.array,
  history: PropTypes.any,
}

export default Designation