import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    FormGroup,
    ModalBody,
    Modal,
    DropdownItem,
    Form,
  } from "reactstrap";
import {
    Block,
    BlockHead,
    BlockBetween,
    BlockHeadContent,
    BlockTitle,
    BlockDes,
    Icon,
    Button,
    Col,
    PaginationComponent,
    DataTable,
    DataTableBody,
    DataTableHead,
    DataTableRow,
    DataTableItem,
    RSelect,
  } from "../../../components/Component";
  import { useForm } from "react-hook-form";
  import { v4 as uuidv4 } from "uuid"
  import slugify from "slugify";
  import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

function Components() {
    const axiosPrivate = useAxiosPrivate()
    const [sm, updateSm] = useState(false);
    const [data, setData] = useState([])
    const [editId, setEditedId] = useState();
    const [modal, setModal] = useState({ edit: false, add: false });
    const initial = {label:"", slug:"", description:"", tags:[]}
    const [formData, setFormData] = useState(initial)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage] = useState(7)

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getComponents = async () => {
            try {
                const response = await axiosPrivate.get('/component/pull', {
                    signal: controller.signal
                })
                isMounted && setData(response.data.data.components)
            } catch(e) {
                console.log(e)
            }
        }
        getComponents()

        return () => {
            isMounted = false
            controller.abort()
        }
    },[axiosPrivate])

    const tagList = [
        { value:"red", label:"red", theme:"red" },
        { value:"blue", label:"blue", theme:"blue" },
        { value:"green", label:"green", theme:"green" },
        { value:"white", label:"white", theme:"white" }
    ]

    // OnChange function to get the input data
    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onFormCancel = () => {
        setModal({ edit: false, add: false });
        setFormData(initial)
    }

    const onEditClick = (id) => {
        data.forEach((item) => {
            if (item.id === id) {
                setFormData({
                    label:item.label,
                    slug:item.slug,
                    description:item.description,
                    tags:item.tags
                })
                setEditedId(id);
            }
        })
        setModal({ edit: true }, { add: false });
    }

    const onFormSubmit = async (sData) => {
        const { label, slug, description } = sData
        let submittedData = {
            id:uuidv4(),
            label:label,
            slug:slugify(slug, {lower:true}) || slugify(label, {lower:true}),
            description:description,
            tags:formData.tags
        }
        await axiosPrivate.post('/component/create', submittedData)
        .then(resp => {
            setFormData(initial)
            setData(resp.data.data.response.components)
            setModal({ add: false})
        })
        .catch(err => {
            console.log(err)
            setModal({ add: false})
        })
    } 

    const onEditSubmit = async (sData) => {
        const { label, slug, description } = sData
        let submittedData = {
            id:editId,
            label:label,
            slug:slugify(slug, {lower:true}) || slugify(label, {lower:true}),
            description:description,
            tags:formData.tags
        }
        await axiosPrivate.post('/component/update', submittedData)
        .then(resp => {
            setFormData(initial)
            setData(resp.data.data.response.components)
            setModal({ edit: false})
        })
        .catch(err => {
            console.log(err)
            setModal({ edit: false})
        })
    }

    // Get current list, pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
        <Head title="Components"></Head>
        <Content>
            <BlockHead size="sm">
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle page> Component Lists</BlockTitle>
                        <BlockDes className="text-soft">You have total {data.length} projects</BlockDes>
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
                                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                                        <Button color="primary">
                                            <Icon name="plus"></Icon>
                                            <span>Add Item</span>
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
                                <span className="sub-text">Component Name</span>
                            </DataTableRow>
                            <DataTableRow size="sm">
                                <span className="sub-text">Identifier</span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                                <span className="sub-text">Group Tag</span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                                <span className="sub-text">Description</span>
                            </DataTableRow>
                            <DataTableRow className="nk-tb-col-tools text-right">
                                <UncontrolledDropdown>
                                    <DropdownToggle tag="a" className="btn btn-xs btn-trigger btn-icon dropdown-toggle mr-n1">
                                        <Icon name="more-h"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <ul className="link-list-opt no-bdr">
                                            {/* <li onClick={(ev) => console.log(ev)}>
                                                <DropdownItem
                                                    tag="a"
                                                    href="#markasdone"
                                                    onClick={(ev) => {
                                                    ev.preventDefault();
                                                    }}
                                                >
                                                    <Icon name="check-round-cut"></Icon>
                                                    <span>Edit Component</span>
                                                </DropdownItem>
                                            </li> */}
                                            <li onClick={(ev) => console.log(ev)}>
                                                <DropdownItem
                                                    tag="a"
                                                    href="#remove"
                                                    onClick={(ev) => {
                                                    ev.preventDefault();
                                                    }}
                                                >
                                                    <Icon name="trash"></Icon>
                                                    <span>Delete Bulk</span>
                                                </DropdownItem>
                                            </li>
                                        </ul>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
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
                                            <span>{item.label}</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>{item.slug}</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>
                                            {item.tags.map((tag) => {
                                                if (item.tags[tag] + 1 === null || undefined) {
                                                    return tag.label;
                                                } else return tag.label + ", ";
                                            })}
                                            </span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>{item.description.slice(0, 25)}</span>{item.description.length > 25 ? "...":""}
                                        </DataTableRow>
                                        <DataTableRow className="nk-tb-col-tools text-right">
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
                                                                <li onClick={(ev) => console.log(ev)}>
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
                            }): null}                        
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
            </Block>
            <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
                <ModalBody>
                    <a
                        href="#cancel"
                        onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                        }}
                        className="close"
                        >
                        <Icon name="cross-sm"></Icon>
                    </a>
                    <div className="p-2">
                        <h5 className="title">Add Component</h5>
                        <div className="mt-4"> 
                            <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                                <Col md="6">
                                    <FormGroup>
                                    <label className="form-label">Label</label>
                                    <input
                                        type="text"
                                        name="label"
                                        defaultValue={formData.label}
                                        placeholder="Enter Component Label"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        ref={register({
                                        required: "This field is required",
                                        })}
                                    />
                                    {errors.label && <span className="invalid">{errors.label.message}</span>}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                    <label className="form-label">Identifier</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        defaultValue={formData.slug}
                                        placeholder="Enter Component Identifier"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <FormGroup>
                                    <label className="form-label">Content</label>
                                    <textarea
                                        name="description"
                                        defaultValue={formData.description}
                                        placeholder="Component content here..."
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control-xl form-control no-resize"
                                        ref={register({
                                        required: "This field is required",
                                        })}
                                    />
                                    {errors.description && <span className="invalid">{errors.description.message}</span>}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label className="form-label">Tags</label>
                                        <RSelect options={tagList} isMulti onChange={(e) => setFormData({ ...formData, tags: e })} />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                    <li>
                                        <Button color="primary" size="md" type="submit">
                                            Add Component
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
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
                <ModalBody>
                    <a
                        href="#cancel"
                        onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                        }}
                        className="close"
                        >
                        <Icon name="cross-sm"></Icon>
                    </a>
                    <div className="p-2">
                        <h5 className="title">Update Component</h5>
                        <div className="mt-4"> 
                            <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                                <Col md="6">
                                    <FormGroup>
                                    <label className="form-label">Label</label>
                                    <input
                                        type="text"
                                        name="label"
                                        defaultValue={formData.label}
                                        placeholder="Enter Component Label"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        ref={register({
                                        required: "This field is required",
                                        })}
                                    />
                                    {errors.label && <span className="invalid">{errors.label.message}</span>}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                    <label className="form-label">Identifier</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        defaultValue={formData.slug}
                                        placeholder="Enter Component Identifier"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <FormGroup>
                                    <label className="form-label">Content</label>
                                    <textarea
                                        name="description"
                                        defaultValue={formData.description}
                                        placeholder="Component content here..."
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control-xl form-control no-resize"
                                        ref={register({
                                        required: "This field is required",
                                        })}
                                    />
                                    {errors.description && <span className="invalid">{errors.description.message}</span>}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label className="form-label">Tags</label>
                                        <RSelect 
                                            options={tagList} 
                                            isMulti 
                                            defaultValue={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e })} 
                                        />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                    <li>
                                        <Button color="primary" size="md" type="submit">
                                            Update Component
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
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </Content>
    </React.Fragment>
  )
}

export default Components