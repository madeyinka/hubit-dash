import React, { useEffect, useState } from 'react'
import { Button, Icon, UserAvatar } from '../../../components/Component';
import ContentAlt from '../../../layout/content/ContentAlt'
import Head from '../../../layout/head/Head'
import Simplebar from "simplebar-react";
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { findUpper } from '../../../utils/Utils';
import MessageCard from './MessageCard';

function Messages() {
  const axiosPrivate = useAxiosPrivate()

  const [data, setData] = useState([])
  const [filterTab, setFilterTab] = useState("1");
  const [filterText, setFilterText] = useState("");
  const [search, setOnSearch] = useState(false);
  const [filteredTabData, setFilteredTabData] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    let isMounted = true
    let filteredData;
    const controller = new AbortController()
    const getMessages = async () => {
      try {
        const response = await axiosPrivate.get('/contact/messages/pull', {
          signal:controller.signal
        })
        isMounted && setData(response.data.data.messages)
        const result = response.data.data.messages
        if (filterTab === "1") {
          filteredData = result.filter((item) => {
            return item.closed === false
          })
          setData(filteredData)
          setFilteredTabData(filteredData)
        } else if (filterTab === "2") {
          filteredData = result.filter((item) => {
            return item.closed === true
          })
          setData(filteredData)
          setFilteredTabData(filteredData)
        } else if (filterTab === "3") {
          filteredData = result.filter((item) => {
            return item.marked === true
          })
          setData(filteredData)
          setFilteredTabData(filteredData)
        } else {
          filteredData = result
          setData(filteredData)
          setFilteredTabData(filteredData)
        }    
      } catch(err) {
        console.log(err)
      }
    }
    getMessages()
    return () => {
      isMounted = false
      controller.abort()
    }
    
  },[axiosPrivate, filterTab])


  useEffect(() => {
    if (filterText !== ""){
      const filteredData = data?.filter((item) => {
        return (
          item.name.toLowerCase().includes(filterText.toLowerCase()) || 
          item.title.toLowerCase().includes(filterText.toLowerCase())
        )
      })
      setData([...filteredData])
    } else {
      setData(filteredTabData)
    }
  },[data, filterText, filteredTabData])

  const onInputChange = (e) => {
    setFilterText(e.target.value);
  };

  const onMessageClick = (id) => {
    setSelectedId(id);
    if (window.innerWidth <= 990) {
      setMobileView(true);
    }
  }

  const onClosed = async (id) => {
    let state = {id:id, closed:true};
    const newData = await axiosPrivate.post('/contact/message/modify', state)
    setData(newData.data.data.message)
  }

  const onSearchBack = () => {
    setOnSearch(false);
    setFilterText("");
  }

  return (
    <React.Fragment>
      <Head title="Contact Messages"></Head>
      <ContentAlt>
        <div className="nk-msg">
          <div className="nk-msg-aside hide-aside">
            <div className="nk-msg-nav">
              <ul className="nk-msg-menu">
                <li className={`nk-msg-menu-item ${filterTab === "1" && " active"}`} onClick={() => setFilterTab("1")}>
                  <a
                    href="#active"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    Active
                  </a>
                </li>
                <li className={`nk-msg-menu-item ${filterTab === "2" && " active"}`} onClick={() => setFilterTab("2")}>
                  <a
                    href="#closed"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    Closed
                  </a>
                </li>
                <li className={`nk-msg-menu-item ${filterTab === "3" && " active"}`} onClick={() => setFilterTab("3")}>
                  <a
                    href="#closed"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    Stared
                  </a>
                </li>
                <li className={`nk-msg-menu-item ${filterTab === "4" && " active"}`} onClick={() => setFilterTab("4")}>
                  <a
                    href="#closed"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    All
                  </a>
                </li>
                <li className="nk-msg-menu-item ml-auto" onClick={() => setOnSearch(true)}>
                  <a
                    href="#search"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                    className="search-toggle toggle-search"
                  >
                    <Icon name="search"></Icon>
                  </a>
                </li>
              </ul>
              <div className={`search-wrap ${search && " active"}`}>
                <div className="search-content">
                  <a
                    href="#search"
                    className="search-back btn btn-icon toggle-search"
                    onClick={(ev) => {
                      ev.preventDefault();
                      onSearchBack();
                    }}
                  >
                    <Icon name="arrow-left"></Icon>
                  </a>
                  <input
                    type="text"
                    className="border-transparent form-focus-none form-control"
                    placeholder="Search by name or message title"
                    onChange={(e) => onInputChange(e)}
                  />
                  <Button className="search-submit btn-icon">
                    <Icon name="search"></Icon>
                  </Button>
                </div>
              </div>
            </div>
            <Simplebar className="nk-msg-list">
              {data.map((item) => {
                return (
                  <div
                  className={`nk-msg-item ${selectedId === item.id ? "current" : ""}`}
                  key={item.id}
                  onClick={() => onMessageClick(item.id)}
                >
                  <UserAvatar
                      className="nk-nk-msg-media"
                      theme={item.theme}
                      image={item.image}
                      text={findUpper(item.name)}
                    ></UserAvatar>
                    <div className="nk-msg-info">
                      <div className="nk-msg-from">
                          <div className="nk-msg-sender">
                            <div className="name">{item.name}</div>
                            {item.closed && <div className={`lable-tag dot bg-danger`}></div>}
                          </div>
                          <div className="nk-msg-meta">
                            {/* <div className="attchment">{item.attactchment && <Icon name="clip-h"></Icon>}</div> */}
                            <div className="date">15 Jan</div>
                          </div>
                      </div>
                      <div className="nk-msg-context">
                        <div className="nk-msg-text">
                          <h6 className="title">{item.title.slice(0,25)}{item.title > 25 ? "...":""}</h6>
                          <p>{item.message.slice(0,50)}</p>
                        </div>
                        <div className="nk-msg-lables">
                          <div className="asterisk">
                            <a
                              href="#starred"
                              onClick={(ev) => {
                                ev.preventDefault();
                              }}
                            >
                              {/* {item.marked ? (
                                <Icon className="asterisk-off" name="star-fill"></Icon>
                              ) : ( */}
                                <Icon className="asterisk-off" name="star"></Icon>
                              {/* )} */}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                )
              })}
            </Simplebar>
          </div>
          <MessageCard
            id={selectedId}
            setMobileView={setMobileView}
            mobileView={mobileView}
            onClosed={onClosed}
            data={data}
          />
        </div>
      </ContentAlt>    
    </React.Fragment>
  )
}

export default Messages