import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody, Spinner, FormGroup } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
} from "../../../components/Component";
import { countryOptions } from "./UserData";
import { getDateStructured } from "../../../utils/Utils";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const UserProfileRegularPage = ({ sm, updateSm, setProfileName }) => {
  const [modalTab, setModalTab] = useState("1");
  const [formData, setFormData] = useState({});
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errorVal, setError] = useState("")

  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fuser = async () => {
      const response = await axiosPrivate.get('/user', {
        signal: controller.signal
      })
      isMounted && setFormData(response.data.data)
    }
    fuser()

    return () => {
      isMounted = false
      controller.abort()
    }
  },[])

  useEffect(() => {
    setProfileName("Hubit Doe");
  }, []);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async() => {
    setLoading(true)
    try{
      await axiosPrivate.put('/user', formData)
      .then(result => {
        setLoading(false)
        setFormData(result.data.data)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      }) 
    } catch(err) {
      setTimeout(() => {
        setError(err.response?.data?.message);
      }, 2000)
    }
    setModal(false);
  };

  return (
    <React.Fragment>
      <Head title="User Profile"></Head>
      <BlockHead size="lg">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle tag="h4">Basic Information</BlockTitle>
            <BlockDes>
              <p>Manage user basic information</p>
            </BlockDes>
          </BlockHeadContent>
          <BlockHeadContent className="align-self-start d-lg-none">
            <Button
              className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
              onClick={() => updateSm(!sm)}
            >
              <Icon name="menu-alt-r"></Icon>
            </Button>
          </BlockHeadContent>
        </BlockBetween>
      </BlockHead>

      <Block>
        <div className="nk-data data-list">
          <div className="data-head">
            <h6 className="overline-title">Basics</h6>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Full Name</span>
              <span className="data-value">{formData.local?.first_name} {formData.local?.last_name}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Display Name</span>
              <span className="data-value">{formData.local?.display_name}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>
          <div className="data-item">
            <div className="data-col">
              <span className="data-label">Email</span>
              <span className="data-value">{formData.local?.email}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more disable">
                <Icon name="lock-alt"></Icon>
              </span>
            </div>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Phone Number</span>
              <span className="data-value text-soft">{formData.local?.phone_number}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>
          {/* <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Date of Birth</span>
              <span className="data-value">{userInfo.dob}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div> */}
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Address</span>
              <span className="data-value">
                {formData?.address},
                <br />
                {formData?.state}, {formData?.country}
              </span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>
        </div>
        {/* <div className="nk-data data-list">
          <div className="data-head">
            <h6 className="overline-title">Preferences</h6>
          </div>
          <div className="data-item">
            <div className="data-col">
              <span className="data-label">Language</span>
              <span className="data-value">English (United State)</span>
            </div>
            <div className="data-col data-col-end">
              <a
                href="#language"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className="link link-primary"
              >
                Change Language
              </a>
            </div>
          </div>
          <div className="data-item">
            <div className="data-col">
              <span className="data-label">Date Format</span>
              <span className="data-value">MM/DD/YYYY</span>
            </div>
            <div className="data-col data-col-end">
              <a
                href="#link"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className="link link-primary"
              >
                Change
              </a>
            </div>
          </div>
          <div className="data-item">
            <div className="data-col">
              <span className="data-label">Timezone</span>
              <span className="data-value">Bangladesh (GMT +6)</span>
            </div>
            <div className="data-col data-col-end">
              <a
                href="#link"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className="link link-primary"
              >
                Change
              </a>
            </div>
          </div>
        </div> */}
      </Block>

      <Modal isOpen={modal} className="modal-dialog-centered" size="lg" toggle={() => setModal(false)}>
        <ModalBody>
          <a
            href="#dropdownitem"
            onClick={(ev) => {
              ev.preventDefault();
              setModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Update Profile</h5>
            <ul className="nk-nav nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${modalTab === "1" && "active"}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalTab("1");
                  }}
                  href="#personal"
                >
                  Personal
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${modalTab === "2" && "active"}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalTab("2");
                  }}
                  href="#address"
                >
                  Address
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div className={`tab-pane ${modalTab === "1" ? "active" : ""}`} id="personal">
                <Row className="gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="first_name">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        className="form-control"
                        name="first_name"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.local?.first_name}
                        placeholder="Enter First name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="last_name">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        className="form-control"
                        name="last_name"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.local?.last_name}
                        placeholder="Enter Last name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="display-name">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="display-name"
                        className="form-control"
                        name="display_name"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.local?.display_name}
                        placeholder="Enter display name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="phone-no">
                        Phone Number
                      </label>
                      <input
                        type="number"
                        id="phone-no"
                        className="form-control"
                        name="phone_number"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.local?.phone_number}
                        placeholder="Phone Number"
                      />
                    </FormGroup>
                  </Col>
                  {/* <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="birth-day">
                        Date of Birth
                      </label>
                      <DatePicker
                        selected={new Date(formData.dob)}
                        className="form-control"
                        onChange={(date) => setFormData({ ...formData, dob: getDateStructured(date) })}
                        maxDate={new Date()}
                      />
                    </FormGroup>
                  </Col>  */}
                  {/* <Col size="12">
                    <div className="custom-control custom-switch">
                      <input type="checkbox" className="custom-control-input form-control" id="latest-sale" />
                      <label className="custom-control-label" htmlFor="latest-sale">
                        Use full name to display{" "}
                      </label>
                    </div>
                  </Col> */}
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button
                          color="primary"
                          size="lg"
                          onClick={(ev) => {
                            ev.preventDefault();
                            submitForm();
                          }}
                        >
                          { loading ? <Spinner size="sm" color="light" /> : "Update Profile"}
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal(false);
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
              <div className={`tab-pane ${modalTab === "2" ? "active" : ""}`} id="address">
                <Row className="gy-4">
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="address-l1"
                        name="address"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData?.address}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  {/* <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        id="address-l2"
                        name="address2"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.address2}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col> */}
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-st">
                        State
                      </label>
                      <input
                        type="text"
                        id="address-st"
                        name="state"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.state}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-county">
                        Country
                      </label>
                      <RSelect
                        options={countryOptions}
                        placeholder="Select a country"
                        defaultValue={[
                          {
                            value: formData.country,
                            label: formData.country,
                          },
                        ]}
                        onChange={(e) => setFormData({ ...formData, country: e.value })}
                      />
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="lg" onClick={() => submitForm()}>
                        { loading ? <Spinner size="sm" color="light" /> : "Update Address"}
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal(false);
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default UserProfileRegularPage;
