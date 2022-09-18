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
  import {useNavigate, useLocation} from "react-router-dom"

function Categories() {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()

    const [sm, updateSm] = useState(false);
    const [data, setData] = useState([])
    const [catOptions, setCatOptions] = useState()
    const [editId, setEditedId] = useState();
    const [modal, setModal] = useState({ edit: false, add: false });
    const initial = {label:"", slug:"", description:"", parent:null, image:""}
    const [formData, setFormData] = useState(initial)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage] = useState(7)
    const [selected, setSelected] = useState();
    const [imagePreview, setImagePreview] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getCategories = async () => {
            try {
                const response = await axiosPrivate.get('/category/pull', {
                    signal: controller.signal
                })
                isMounted && setData(response.data.data.categories)
            } catch(e) {
                if (e.response.status === 403) {
                    navigate('/auth-login', { state: { from:location }, replace: true })
                }
            }
        }
        getCategories()

        return () => {
            isMounted = false
            controller.abort()
        }
    },[navigate, axiosPrivate, location])

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

     // OnChange function to get the input data
     const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const onEditClick = (id) => {
        data.forEach((item) => {
            if (item.id === id) {
                setFormData({
                    label:item.label,
                    slug:item.slug,
                    description:item.description,
                    parent:item.parent,
                    image:item.image
                })
                setImageUrl(item.image)
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
            parent:formData.parent,
            image:imageUrl
        }
        await axiosPrivate.post('/category/create', submittedData)
        .then(resp => {
            setFormData(initial)
            setImageUrl('')
            setData(resp.data.data.response.categories)
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
            parent:formData.parent,
            image:imageUrl
        }
        await axiosPrivate.post('/category/update', submittedData)
        .then(resp => {
            setFormData(initial)
            setData(resp.data.data.response.categories)
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
                        <BlockTitle page> Categories</BlockTitle>
                        <BlockDes className="text-soft">You have total {data.length} categories</BlockDes>
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
                    <DataTableBody>
                        <DataTableHead className="nk-tb-item nk-tb-head">
                            <DataTableRow className="nk-tb-col-check">
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                    <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id="pid-all"
                                   // onChange={(e) => selectorCheck(e)}
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
                                <span className="sub-text">Parent</span>
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
                                               // onChange={(e) => selectorCheck(e)}
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
                                            <span>{item?.parent?.label ? item?.parent?.label : 'None'}</span>
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
                        <h5 className="title">Add Category</h5>
                        <div className="mt-4"> 
                            <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                                <Col md="12">
                                    <FormGroup>
                                    <label className="form-label">Label</label>
                                    <input
                                        type="text"
                                        name="label"
                                        defaultValue={formData.label}
                                        placeholder="Enter Category Label"
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
                                        placeholder="Enter Category Identifier"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label className="form-label">Parent</label>
                                        <RSelect options={catOptions} onChange={(e) => setFormData({ ...formData, parent: e })} />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <FormGroup>
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        defaultValue={formData.description}
                                        placeholder="Category description here..."
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control-xl form-control no-resize"
                                        ref={register({
                                            required: "This field is required",
                                        })}
                                    />
                                    {errors.description && <span className="invalid">{errors.description.message}</span>}
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
                                    <label className="form-label">Image / Icon</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={imageUrl}
                                        placeholder="Enter Image URL or Icon class"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        //ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                    <li>
                                        <Button color="primary" size="md" type="submit">
                                            Add Category
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
                                <Col md="12">
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
                                    <label className="form-label">Image / Icon</label>
                                    <input
                                        type="text"
                                        name="image"
                                        defaultValue={imageUrl}
                                        placeholder="Enter Image URL or Icon class"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        //ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                    <li>
                                        <Button color="primary" size="md" type="submit">
                                            Update Category
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

export default Categories