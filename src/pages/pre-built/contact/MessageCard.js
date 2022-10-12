import React, { useEffect, useRef, useState } from 'react'
import classNames from "classnames";
import SimpleBar from "simplebar-react";
import { Button, Icon, UserAvatar } from '../../../components/Component';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { findUpper } from '../../../utils/Utils';

function MessageCard({ id, mobileView, onClosed, setMobileView, data }) {
  const [sidebar, setSideBar] = useState(false)
  const [item, setItem] = useState({})
  //const [formTab, setFormTab] = useState("1")

  const resizeFunc = () => {
    if (window.innerWidth > 1540) {
      setSideBar(true);
    } else {
      setSideBar(false);
    }
  }

  useEffect(() => {
    resizeFunc();
    window.addEventListener("resize", resizeFunc);
    return () => {
      window.removeEventListener("resize", resizeFunc);
    };
  }, [])

  const messagesEndRef = useRef(null)

  // const scrollToBottom = () => {
  //   const scrollHeight = messagesEndRef.current.scrollHeight;
  //   const height = messagesEndRef.current.clientHeight;
  //   const maxScrollTop = scrollHeight - height;
  //   messagesEndRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  // }

  useEffect(() => {
    const checkId = (id) => {
      data.forEach((items) => {
        if (items.id === id) {
          setTimeout(setItem(items), 1000);
        }
      });
    };
    checkId(id);
  }, [id, data])

  const chatBodyClass = classNames({
    "nk-msg-body": true,
    "bg-white": true,
    "show-message": mobileView,
    "profile-shown": sidebar,
  });
  return (
    <React.Fragment>
      {Object.keys(item).length > 0 && ( 
        <div className={chatBodyClass}>
          <div className="nk-msg-head">
            <h4 className="title d-none d-lg-block">{item.title}</h4>
            <div className="nk-msg-head-meta">
              <div className="d-none d-lg-block">
                <ul className="nk-msg-tags">
                  <li>
                    <span className="label-tag">
                      <Icon name="flag-fill"></Icon> <span>{item.unit.label}</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="d-lg-none">
                <Button className="btn-icon btn-trigger nk-msg-hide ml-n1" onClick={() => setMobileView(false)}>
                  <Icon name="arrow-left"></Icon>
                </Button>
              </div>
              <ul className="nk-msg-actions">
                {item.closed ? (
                  <li>
                    <span className="badge badge-dim badge-success badge-sm">
                      <Icon name="check"></Icon>
                      <span>Closed</span>
                    </span>
                  </li>
                ) : (
                  <li>
                    <Button outline size="sm" color="light" className="btn-dim" onClick={() => onClosed(id)}>
                      <Icon name="check"></Icon>
                      <span>Mark as Closed</span>
                    </Button>
                  </li>
                )}

                {/* <li className="d-lg-none">
                  <Button
                    size="sm"
                    color="white"
                    className="btn btn-icon btn-light profile-toggle"
                    onClick={() => toggleSidebar()}
                  >
                    <Icon name="info-i"></Icon>
                  </Button>
                </li> */}
                <li>
                  <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="btn btn-icon btn-sm btn-white btn-light dropdown-toggle">
                      <Icon name="more-h"></Icon>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <ul className="link-list-opt no-bdr">
                        <li>
                          <DropdownItem
                            tag="a"
                            href="#dropdown"
                            onClick={(ev) => {
                              ev.preventDefault();
                              //toggleAssignModal();
                            }}
                          >
                            <Icon name="user-add"></Icon>
                            <span>Assign To Unit</span>
                          </DropdownItem>
                        </li>
                          <li>
                            <DropdownItem
                              tag="a"
                              href="#dropdown"
                              onClick={(ev) => {
                                ev.preventDefault();
                                //onClosed(id);
                              }}
                            >
                              <Icon name="trash"></Icon>
                              <span>Remove Message</span>
                            </DropdownItem>
                          </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li>
              </ul>
            </div>
            
          </div>
          {/*nk-msg-head*/}
          <SimpleBar className="nk-msg-reply nk-reply" scrollableNodeProps={{ ref: messagesEndRef }}>
            <div className="nk-msg-head py-4 d-lg-none">
              <h4 className="title">{item.title}</h4>
              <ul className="nk-msg-tags">
                <li>
                  <span className="label-tag">
                    <Icon name="flag-fill"></Icon> <span>{item.unit.label}</span>
                  </span>
                </li>
              </ul>
            </div>
            <div className="nk-reply-item">
              <div className="nk-reply-header">
                <div className="user-card">
                  <UserAvatar size="sm" theme={item.theme} text={findUpper(item.name)} image={item.image} />
                  <div className="user-name">{item.name}</div>
                </div>
                <div className="date-time">{item.date}</div>
              </div>
              <div className="nk-reply-body">
                <div className="nk-reply-entry entry">{item.message}
                </div>
              </div>
            </div>
          </SimpleBar>
        </div>
      )}
        
    </React.Fragment>
  )
}

export default MessageCard