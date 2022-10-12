import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Modal, ModalBody, UncontrolledDropdown } from "reactstrap";
import { 
    Block, 
    BlockBetween, 
    BlockDes, 
    BlockHead, 
    BlockHeadContent, 
    BlockTitle, 
    Button, 
    Col, 
    DataTable, 
    DataTableBody, 
    DataTableHead, 
    DataTableItem, 
    DataTableRow, 
    Icon, 
    PaginationComponent, 
    RSelect
} from "../../../components/Component";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { v4 as uuidv4 } from "uuid"
import slugify from "slugify";

function Services() {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()

    const [sm, updateSm] = useState(false);
    const initial = {label:"", slug:"", description:"", image:"", parent:null, status:null}
    const [formData, setFormData] = useState(initial)
    const [editId, setEditedId] = useState()
    const [data, setData] = useState([])
    const [catOptions, setCatOptions] = useState()
    const [modal, setModal] = useState({ edit: false, add: false });
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage] = useState(7)
    const [imageUrl, setImageUrl] = useState('')
    const [selected, setSelected] = useState();
    const [imagePreview, setImagePreview] = useState('')

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getServices = async () => {
            try {
                const response = await axiosPrivate.get('/service/pull', {
                    signal: controller.signal
                })
                isMounted && setData(response.data.data.response)
            } catch(e) {
                if (e.response.status === 403) {
                    navigate('/auth-login', { state: { from:location }, replace: true })
                }
            }
        }
        getServices()

        return () => {
            isMounted = false
            controller.abort()
        }
    },[axiosPrivate, location, navigate])

    useEffect(() => {
        let isMounted = true, catList = []
        if (data && data.length > 0) {
           // eslint-disable-next-line array-callback-return
           data.filter((item) => {
               if(item.parent == null) {
                   isMounted && catList.push({value: item.id, label:item.label})
               }
           })
           setCatOptions(catList)
        }
        return () => {
           isMounted = false
        }
   },[data])

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleImageInput = (e) => {
        const file = e.target.files[0]
        base64Encode(file)
        setSelected(e.target.value)
    }

    const base64Encode = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
    }

    const uploadImage = async (e) => {
        e.preventDefault()
        if (!imagePreview) return;
        const data = {data:imagePreview}
        try {
            await axiosPrivate.post('/assets/upload-to-cloud', data)
            .then(response => {
                setSelected('')
                setFormData({...formData, "image":response.data.url})
                setImageUrl(response.data.url)
            })

        } catch (e) {
            console.log(e)
        }
    }

    const onFormCancel = () => {
        setModal({ edit: false, add: false });
        setFormData(initial)
    }

    const onFormSubmit = async (sData) => {
        const {label, slug, description} = sData
        let submittedData = {
            id: uuidv4(),
            label: label,
            slug:slugify(slug, {lower:true}) || slugify(label, {lower:true}),
            description:description,
            parent:formData.parent,
            status:formData.status,
            image:formData.image 
        }
        await axiosPrivate.post('/service/create', submittedData)
        .then(resp => {
            setFormData(initial)
            setImageUrl('')
            setData(resp.data.data.response.services)
            setModal({ add: false})
        })
        .catch(err => {
            console.log(err)
            //setModal({ add: false})
        })
    }

    const onEditClick = (id) => {
        data.forEach((item) => {
            if (item.id === id) {
                setFormData({
                    label:item.label,
                    slug:item.slug,
                    description:item.description,
                    parent:item.parent,
                    image:item.image,
                    status:item.status
                })
                setImageUrl(item.image)
                setEditedId(id);
            }
        })
        setModal({ edit: true }, { add: false });
    }

    const onEditSubmit = async (sData) => {
        const {label, slug, description} = sData
        let submittedData = {
            id:editId,
            label:label,
            slug:slugify(slug, {lower:true}) || slugify(label, {lower:true}),
            description:description,
            parent:formData.parent,
            status:formData.status,
            image:formData.image
        }
        await axiosPrivate.post('/service/update', submittedData)
        .then(resp => {
            setFormData(initial)
            setData(resp.data.data.response.services)
            setModal({ edit: false })
        })
        .catch(err => {
            console.log(err)
        })
    }

    // Get current list, pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const { errors, register, handleSubmit } = useForm();
    return (
        <React.Fragment>
            <Head title="Services"></Head>
            <Content>
                <BlockHead size="sm">
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle page> Service Lists</BlockTitle>
                        <BlockDes className="text-soft">You have total {data?.length} projects</BlockDes>
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
                                    <span className="sub-text">Service Name</span>
                                </DataTableRow>
                                <DataTableRow size="sm">
                                    <span className="sub-text">Service Group</span>
                                </DataTableRow>
                                <DataTableRow size="sm">
                                    <span className="sub-text">Description</span>
                                </DataTableRow>
                                <DataTableRow size="sm">
                                    <span className="sub-text">Image/Icon</span>
                                </DataTableRow>
                                <DataTableRow size="sm">
                                    <span className="sub-text">Status</span>
                                </DataTableRow>
                                {/* <DataTableRow size="sm">
                                    <span className="sub-text">Date Added</span>
                                </DataTableRow> */}
                                <DataTableRow className="nk-tb-col-tools text-right">
                                    <DropdownToggle tag="a" className="btn btn-xs btn-outline-light btn-icon dropdown-toggle">
                                        <Icon name="plus"></Icon>
                                    </DropdownToggle>
                                </DataTableRow>
                            </DataTableHead>
                            {currentItems.length > 0 
                                ? currentItems.map((item) => {
                                    return (
                                        <DataTableItem>
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
                                                    <span>{item.label.slice(0, 17)}</span>
                                                </DataTableRow>
                                                <DataTableRow>
                                                    <span>{item?.parent?.label ? item.parent.label : "None"}</span>
                                                </DataTableRow>
                                                <DataTableRow>
                                                    <span>{item.description.slice(0, 26)}</span>
                                                </DataTableRow>
                                                <DataTableRow>
                                                    <span>{item.image.slice(0, 30)}</span>
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
                            <h5 className="title">Add Service</h5>
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
                                    <Col size="6">
                                        <div className="form-control-wrap">
                                        <label className="form-label">Upload Image</label>
                                            <div className="input-group">
                                                <div className="custom-file">
                                                <input
                                                    type="file"
                                                    className="custom-file-input"
                                                    id="inputGroupFile04"
                                                     onChange={handleImageInput}
                                                />
                                                <label className="custom-file-label" htmlFor="inputGroupFile04">
                                                {selected === "" ? "Choose files" : selected}
                                                </label>
                                                </div>
                                                <div className="input-group-append">
                                                <Button outline color="primary" onClick={uploadImage} className="btn-dim">
                                                    Upload
                                                </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label className="form-label">Image Link / Icon</label>
                                            <input
                                                type="text"
                                                name="image"
                                                defaultValue={imageUrl}
                                                placeholder="Enter Image URL or Icon class"
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                                            <label className="form-label">Parent</label>
                                            <RSelect options={catOptions} onChange={(e) => setFormData({ ...formData, parent: e })} />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label className="form-label">Status</label>
                                            <RSelect options={[{value:1, label:"Enable"}, {value:0, label:"Disable"}]} onChange={(e) => setFormData({ ...formData, status: e.value })} />
                                        </FormGroup>
                                    </Col>
                                    
                                    <Col size="12">
                                        <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                        <li>
                                            <Button color="primary" size="md" type="submit">
                                                Add Service
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
                            <h5 className="title">Update Service</h5>
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
                                    <Col size="6">
                                        <div className="form-control-wrap">
                                        <label className="form-label">Upload Image</label>
                                            <div className="input-group">
                                                <div className="custom-file">
                                                <input
                                                    type="file"
                                                    className="custom-file-input"
                                                    id="inputGroupFile04"
                                                     onChange={handleImageInput}
                                                />
                                                <label className="custom-file-label" htmlFor="inputGroupFile04">
                                                {selected === "" ? "Choose files" : selected}
                                                </label>
                                                </div>
                                                <div className="input-group-append">
                                                <Button outline color="primary" onClick={uploadImage} className="btn-dim">
                                                    Upload
                                                </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label className="form-label">Image Link / Icon</label>
                                            <input
                                                type="text"
                                                name="image"
                                                defaultValue={imageUrl}
                                                placeholder="Enter Image URL or Icon class"
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                                            <label className="form-label">Parent</label>
                                            <RSelect 
                                                options={catOptions}
                                                defaultValue={formData.parent} 
                                                onChange={(e) => setFormData({ ...formData, parent: e })} 
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label className="form-label">Status</label>
                                            <RSelect 
                                                options={[{value:1, label:"Enable"}, {value:0, label:"Disable"}]}
                                                defaultValue={formData.status ? {value:1, label:"Enable"} : {value:0, label:"Disable"}}  
                                                onChange={(e) => setFormData({ ...formData, status: e.value })} 
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col size="12">
                                        <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                        <li>
                                            <Button color="primary" size="md" type="submit">
                                                Update Service
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

export default Services