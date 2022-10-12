import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import UserProfileRegularPage from "./UserProfile";
import UserProfileSettingPage from "./UserProfileSetting";
import UserProfileNotificationPage from "./UserProfileNotification";
import UserProfileActivityPage from "./UserProfileActivity";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Icon, UserAvatar } from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";

const UserProfileLayout = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView , setMobileView] = useState(false);
  const [profileName, setProfileName] = useState("Abu Bin Ishtiak");

  const location = useLocation()
  
  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
      updateSm(false);
    });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);
  
  return (
    <React.Fragment>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <div className="card-inner-group">
                <div className="card-inner">
                  <div className="user-card">
                    <UserAvatar text={findUpper(profileName)} theme="primary" />
                    <div className="user-info">
                      <span className="lead-text">{profileName}</span>
                      <span className="sub-text">info@softnio.com</span>
                    </div>
                    <div className="user-action">
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-icon btn-trigger mr-n2">
                          <Icon name="more-v"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="camera-fill"></Icon>
                                <span>Change Photo</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="edit-fill"></Icon>
                                <span>Update Profile</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div>
                </div>
                {/* <div className="card-inner">
                  <div className="user-account-info py-0">
                    <h6 className="overline-title-alt">Nio Wallet Account</h6>
                    <div className="user-balance">
                      12.395769 <small className="currency currency-btc">BTC</small>
                    </div>
                    <div className="user-balance-sub">
                      Locked{" "}
                      <span>
                        0.344939 <span className="currency currency-btc">BTC</span>
                      </span>
                    </div>
                  </div>
                </div> */}
                <div className="card-inner p-0">
                  <ul className="link-list-menu">
                    <li onClick={() => updateSm(false)}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/dashboard/user/basic-information`}
                        className={
                          location.pathname === "/dashboard/user/basic-information" ? "active" : ""
                        }
                      >
                        <Icon name="user-fill-c"></Icon>
                        <span>Basic Information</span>
                      </Link>
                    </li>
                    {/* <li onClick={() => updateSm(false)}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/dashboard/user/business-information`}
                        className={
                          location.pathname === "/dashboard/user/business-information"
                            ? "active"
                            : ""
                        }
                      >
                        <Icon name="globe"></Icon>
                        <span>Business Information</span>
                      </Link>
                    </li>
                    <li onClick={() => updateSm(false)}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/dashboard/user/account-setting`}
                        className={
                          location.pathname === "/dashboard/user/account-setting" ? "active" : ""
                        }
                      >
                        <Icon name="account-setting"></Icon>
                        <span>Account Setting</span>
                      </Link>
                    </li>
                    <li onClick={() => updateSm(false)}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/dashboard/user/security-setting`}
                        className={
                          location.pathname === "/dashboard/user/security-setting" ? "active" : ""
                        }
                      >
                        <Icon name="lock-alt-fill"></Icon>
                        <span>Security Setting</span>
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <Routes>
                <Route
                  path="/basic-information"
                  element={<UserProfileRegularPage updateSm={updateSm} sm={sm} setProfileName={setProfileName} />}
                ></Route>
                <Route
                  path="/business-information"
                  element={<UserProfileNotificationPage updateSm={updateSm} sm={sm} />}
                ></Route>
                <Route
                  path="/account-setting"
                  element={<UserProfileActivityPage updateSm={updateSm} sm={sm} />}
                ></Route>
                <Route
                  path="/security-setting"
                  element={<UserProfileSettingPage updateSm={updateSm} sm={sm} />}
                ></Route>
              </Routes>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileLayout;
