import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Col, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Row, UncontrolledDropdown } from 'reactstrap'
import { Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Button, DataTable, DataTableBody, DataTableHead, DataTableItem, DataTableRow, Icon, OverlineTitle, PaginationComponent, PreviewCard, RSelect } from '../../../components/Component'
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import Content from '../../../layout/content/Content'
import Head from '../../../layout/head/Head'
import { v4 as uuidv4 } from "uuid"
import slugify from "slugify";
import { useNavigate, useLocation } from 'react-router-dom'

function Units() {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()
    const initial = {name:"", email:"", status:null}
    const [formData, setFormData] = useState(initial)
    const [data, setData] = useState([])
    const [editId, setEditId] = useState("")
    const [titleTxt, setTitleTxt] = useState("Add Unit")
    const [btnTxt, setBtnTxt] = useState("Add Unit")

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()
        const getUnits = async () => {
            try {
                const response = await axiosPrivate.get('/contact/unit/pull', {
                    signal:controller.signal
                })
                isMounted && setData(response.data.data.units)
            } catch (e) {
                if (e.response.status === 403) {
                    navigate('/auth-login', { state: { from:location }, replace: true })
                }
            }
        }
        getUnits()

        return () => {
            isMounted = false
            controller.abort()
        }
    },[axiosPrivate, location, navigate])

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onFormSubmit = async (sData) => {
        const {name, email} = sData
        if (editId === "") {
            let submittedData = {
                id: uuidv4(),
                name:name,
                slug:slugify(slugify(name, {lower:true})+ "-" +Date.now()),
                email:email,
                status:formData.status
            }
            await axiosPrivate.post('/contact/unit/create', submittedData)
            .then(resp => {
                setFormData(initial)
                setData(resp.data.data.response.units)
            })
        } else {
            let submittedData = {
                id: editId,
                name:name,
                slug:slugify(slugify(name, {lower:true})+ "-" + Date.now()),
                email:email,
                status:formData.status
            }
            //console.log(submittedData)
            await axiosPrivate.post('/contact/unit/update', submittedData)
            .then(resp => {
                setFormData(initial)
                setData(resp.data.data.response.units)
            })
        }
    }

    const onFormCancel = () => {
        setFormData(initial)
        setTitleTxt("Add Unit")
        setBtnTxt("Add Unit")
    }

    const onEditClick = (id) => {
        setTitleTxt("Edit Unit")
        setBtnTxt("Update Unit")
        data.forEach((item) => {
            if (item.id === id) {
                setFormData({
                    name:item.name,
                    email:item.email,
                    status:item.status
                })
                setEditId(id)
            }
        })
    }

    // Get current list, pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage] = useState(3)
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const { errors, register, handleSubmit } = useForm();
  return (
    <React.Fragment>
        <Head title="Contact Unit" />
        <Content>
            <BlockHead size="sm">
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle page>Contact Unit</BlockTitle>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            <Block size="lg">
                <Row className="g-gs">
                    <Col lg="4">
                        <PreviewCard>
                            <OverlineTitle tag="span" className="preview-title-lg mb-3">
                                {titleTxt}{" "}
                            </OverlineTitle>
                            <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                                <Col md="12">
                                    <FormGroup>
                                        <label className="form-label">Unit Name</label>
                                        <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                placeholder="Enter Unit Name"
                                                onChange={(e) => onInputChange(e)}
                                                className="form-control"
                                                ref={register({
                                                    required: "This field is required",
                                                })}
                                            />
                                            {errors.name && <span className="invalid">{errors.name.message}</span>}
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup>
                                        <label className="form-label">Unit Email</label>
                                        <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                placeholder="Enter Unit Email"
                                                onChange={(e) => onInputChange(e)}
                                                className="form-control"
                                                ref={register({
                                                    required: "This field is required",
                                                })}
                                            />
                                            {errors.email && <span className="invalid">{errors.email.message}</span>}
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup>
                                        <label className="form-label">Status</label>
                                        <RSelect 
                                            options={[{value:1, label:"Enable"}, {value:0, label:"Disable"}]} 
                                            value={formData.status ? {value:1, label:"Enable"} : {value:0, label:"Disable"}} 
                                            onChange={(e) => setFormData({ ...formData, status: e.value })} 
                                        />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                        <li>
                                            <Button color="primary" size="md" type="submit">
                                                {btnTxt}
                                            </Button>
                                        </li>
                                        <li>
                                            <Button
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    onFormCancel();
                                                }}
                                                className="link link-light"
                                            >
                                                Cancel
                                            </Button>
                                        </li>
                                    </ul>
                                </Col>
                            </Form>
                        </PreviewCard>
                    </Col>
                    <Col lg="8">
                        <PreviewCard>
                            <OverlineTitle tag="span" className="preview-title-lg mb-3">
                                Contact Units{" "}
                            </OverlineTitle>
                            <DataTable className="card-stretch">
                                <DataTableBody>
                                    <DataTableHead className="nk-tb-item nk-tb-head">
                                        <DataTableRow className="nk-tb-col-check">
                                            <div className="custom-control custom-control-sm custom-checkbox notext">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input form-control"
                                                    id="pid-all"
                                                    //onChange={(e) => selectorCheck(e)}
                                                />
                                                <label className="custom-control-label" htmlFor="pid-all"></label>
                                            </div>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Unit Name</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Unit Email</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
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
                                                                id="pid-all"
                                                                //onChange={(e) => selectorCheck(e)}
                                                            />
                                                                <label className="custom-control-label" htmlFor="pid-all"></label>
                                                        </div>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span>{item.name}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span>{item.email}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span>{item.status ? "Enabled": "Disabled"}</span>
                                                    </DataTableRow>
                                                    <DataTableRow className="nk-tb-col-tools">
                                                        <ul className="nk-tb-actions gx-1">
                                                            <li>
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
                                                                        <Icon name="more-h"></Icon>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu right>
                                                                        <ul className="link-list-opt no-bdr">
                                                                            <li onClick={() => onEditClick(item.id)}>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#edit"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                    }}
                                                                                >
                                                                                    <Icon name="edit"></Icon>
                                                                                    <span>Edit</span>
                                                                                </DropdownItem>
                                                                            </li>
                                                                            <li>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#remove"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                    }}
                                                                                >
                                                                                    <Icon name="trash"></Icon>
                                                                                    <span>Remove Item</span>
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
                                        }) : null}
                                </DataTableBody>
                                <div className="card-inner">
                                    {data.length > 0 ? (
                                    <PaginationComponent
                                        itemPerPage={itemPerPage}
                                        totalItems={data.length}
                                        paginate={paginate}
                                        currentPage={currentPage}
                                    />
                                    ) : (
                                        <div className="text-center">
                                        <span className="text-silent">No component found</span>
                                        </div>
                                    )}
                                </div>
                            </DataTable>
                        </PreviewCard>
                    </Col>
                </Row>
            </Block>
        </Content>
    </React.Fragment>
  )
}

export default Units