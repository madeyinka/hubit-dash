import React, {useEffect, useState} from 'react'
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
 
  PaginationComponent,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  RSelect,
} from "../../../components/Component";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useNavigate, useLocation} from "react-router-dom"
import {momentFormat, postBulkActions } from "../../../utils/Utils"

function PostLists() {
  const navigate = useNavigate()
  const location = useLocation()
  const axiosPrivate = useAxiosPrivate()

  const [sm, updateSm] = useState(false);
  const [data, setData] = useState([])
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");

  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const getPosts = async () => {
      try {
        const response = await axiosPrivate.get('/post/pull', {
          signal:controller.signal
        })
        isMounted && setData(response.data.data.posts)
      } catch (e) {
        if (e.response.status === 403) {
          navigate('/auth-login', { state: { from:location }, replace: true })
        }
      }
    }
    getPosts()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [navigate, axiosPrivate, location])


  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to set the action to be taken in table header
  const onActionText = (e) => {
    setActionText(e.value);
  };

  // function which fires on applying selected action
  const onActionClick = (e) => {
    if (actionText === "unpublish") {
      let newData = data.map((item) => {
        if (item.status === true) item.status = false;
        return item
      })
      console.log([...newData])
    }
    // if (actionText === "suspend") {
    //   let newData = data.map((item) => {
    //     if (item.checked === true) item.status = "Suspend";
    //     return item;
    //   });
    //   setData([...newData]);
    // } else if (actionText === "delete") {
    //   let newData;
    //   newData = data.filter((item) => item.checked !== true);
    //   setData([...newData]);
    // }
  };

  // function which selects all the items
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      //item.status = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function to change the selected property of an item
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = e.currentTarget.status;
    setData([...newData]);
  };

  const onEditClick = (id) => {

  }

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <Head title="Post Listing"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Post Listings
              </BlockTitle>
              <BlockDes className="text-soft">You have total {data.length} posts</BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt">
                      <Button onClick={(e) => {e.preventDefault(); navigate("/dashboard/post/add-new")}} color="primary">
                          <Icon name="plus"></Icon>
                          <span>Add New</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap">
                      <RSelect
                        options={postBulkActions}
                        className="w-130px"
                        placeholder="Bulk Action"
                        onChange={(e) => onActionText(e)}
                      />
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          disabled={actionText !== "" ? false : true}
                          color="light"
                          outline
                          className="btn-dim"
                          onClick={(e) => onActionClick(e)}
                        >
                          Apply
                        </Button>
                      </span>
                      <span className="d-md-none">
                        <Button
                          color="light"
                          outline
                          disabled={actionText !== "" ? false : true}
                          className="btn-dim btn-icon"
                          onClick={(e) => onActionClick(e)}
                        >
                          <Icon name="arrow-right"></Icon>
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                            {/* <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <div className="dot dot-primary"></div>
                                  <Icon name="filter-alt"></Icon>
                                </DropdownToggle>
                                <DropdownMenu
                                  right
                                  className="filter-wg dropdown-menu-xl"
                                  style={{ overflow: "visible" }}
                                >
                                  <div className="dropdown-head">
                                    <span className="sub-title dropdown-title">Filter Users</span>
                                    <div className="dropdown">
                                      <a
                                        href="#more"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                        className="btn btn-sm btn-icon"
                                      >
                                        <Icon name="more-h"></Icon>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="dropdown-body dropdown-body-rg">
                                    <Row className="gx-6 gy-3">
                                      <Col size="6">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            id="hasBalance"
                                          />
                                          <label className="custom-control-label" htmlFor="hasBalance">
                                            {" "}
                                            Have Balance
                                          </label>
                                        </div>
                                      </Col>
                                      <Col size="6">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            id="hasKYC"
                                          />
                                          <label className="custom-control-label" htmlFor="hasKYC">
                                            {" "}
                                            KYC Verified
                                          </label>
                                        </div>
                                      </Col>
                                      <Col size="6">
                                        <FormGroup>
                                          <label className="overline-title overline-title-alt">Role</label>
                                          <RSelect options={filterRole} placeholder="Any Role" />
                                        </FormGroup>
                                      </Col>
                                      <Col size="6">
                                        <FormGroup>
                                          <label className="overline-title overline-title-alt">Status</label>
                                          <RSelect options={filterStatus} placeholder="Any Status" />
                                        </FormGroup>
                                      </Col>
                                      <Col size="12">
                                        <FormGroup className="form-group">
                                          <button type="button" className="btn btn-secondary">
                                            Filter
                                          </button>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="dropdown-foot between">
                                    <a
                                      href="#reset"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                      className="clickable"
                                    >
                                      Reset Filter
                                    </a>
                                    <a
                                      href="#save"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      Save Filter
                                    </a>
                                  </div>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li> */}
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle color="tranparent" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right className="dropdown-menu-xs">
                                  <ul className="link-check">
                                    <li>
                                      <span>Show</span>
                                    </li>
                                    <li className={itemPerPage === 10 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(10);
                                        }}
                                      >
                                        10
                                      </DropdownItem>
                                    </li>
                                    <li className={itemPerPage === 15 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(15);
                                        }}
                                      >
                                        15
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                  <ul className="link-check">
                                    <li>
                                      <span>Order</span>
                                    </li>
                                    <li className={sort === "dsc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("dsc");
                                          //sortFunc("dsc");
                                        }}
                                      >
                                        DESC
                                      </DropdownItem>
                                    </li>
                                    <li className={sort === "asc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("asc");
                                          //sortFunc("asc");
                                        }}
                                      >
                                        ASC
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search record by title"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody compact>
              <DataTableHead>
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      onChange={(e) => selectorCheck(e)}
                      id="uid"
                    />
                    <label className="custom-control-label" htmlFor="uid"></label>
                  </div>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Title</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Category</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Type</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Author</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Featured</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Pub Date</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <DropdownToggle tag="a" className="btn btn-xs btn-outline-light btn-icon dropdown-toggle">
                    <Icon name="plus"></Icon>
                  </DropdownToggle>
                </DataTableRow>
              </DataTableHead>
              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow>
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              //defaultChecked={item.status}
                              id={item.id + "uid1"}
                              key={Math.random()}
                              onChange={(e) => onSelectChange(e, item.id)}
                            />
                            <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-lead">{item.title.slice(0, 40)}{item.title.length > 40 ? "...":""}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.category.label}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.type.label}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.author}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span
                            className={`badge badge-dot badge-${
                              item.post_settings.featured ? "success" : "danger"
                            }`}
                          >{item.post_settings.featured ? "On": "Off"}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{momentFormat(item.pub_date, "dmy")}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span
                            className={`tb-status text-${
                              item.status ? "success" : "warning" 
                            }`}
                          >{item.status ? "Active" : "Pending"}</span>
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    <li>
                                        <DropdownItem
                                          tag="a"
                                          href="#edit"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            navigate("/dashboard/post/edit/"+item.id)
                                          }}
                                        >
                                        <Icon name="edit"></Icon>
                                        <span>Edit</span>
                                        </DropdownItem>
                                    </li>
                                    <li onClick={() => onEditClick(item.id)}>
                                        <DropdownItem
                                          tag="a"
                                          href="#delete"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                          }}
                                        >
                                        <Icon name="trash"></Icon>
                                        <span>Delete</span>
                                        </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    )
                }): null}
            </DataTableBody>
          </DataTable>
          <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
        </Block>
      </Content>
    </React.Fragment>
  )
}

export default PostLists