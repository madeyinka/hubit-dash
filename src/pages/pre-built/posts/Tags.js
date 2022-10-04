import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { FormGroup, Row } from "reactstrap";
import {
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    ModalBody,
    Modal,
    DropdownItem,
    Form
  } from "reactstrap";
  import {
    Block,
    BlockHead,
    BlockBetween,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Col,
    Button,
    PaginationComponent,
    DataTable,
    DataTableBody,
    DataTableHead,
    DataTableRow,
    DataTableItem,
    OverlineTitle,
    PreviewCard
  } from "../../../components/Component";
  import { useForm } from "react-hook-form";
  import { v4 as uuidv4 } from "uuid"
  import slugify from "slugify";
  import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
  import {useNavigate, useLocation} from "react-router-dom"
  import { momentFormat } from "../../../utils/Utils";

function Attributes() {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()
    const initial = {name:"", profile:"", image:"picture.jpeg"}
    const [authors, setAuthors] = useState([])
    const [authorData, setAuthorData] = useState(initial)
    const [sm, updateSm] = useState(false);
    const [modal, setModal] = useState({ edit: false, add: false });

    const [editId, setEditedId] = useState();
    const [selected, setSelected] = useState();
    const [imagePreview, setImagePreview] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage] = useState(5)

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const { errors, register, handleSubmit } = useForm();
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const authorsData = authors.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()
        const fetchAuthors = async () => {
            try {
                const response = await axiosPrivate.get('/post/author/pull', {
                    signal: controller.signal
                })
                isMounted && setAuthors(response.data.data.response)
            } catch (e) {
                if (e.response.status === 403) {
                    navigate('/auth-login', { state: { from:location }, replace: true })
                }
            }
        }
        fetchAuthors()
        return () => {
            isMounted = false
            controller.abort()
        }
    },[axiosPrivate, location, navigate])

    // OnChange function to get the input data
    const onInputChange = (e) => {
        setAuthorData({ ...authorData, [e.target.name]: e.target.value });
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
            console.error(e.message)
        }
    }

    const onEditClick = (id) => {
        authors.forEach((item) => {
            if (item.id === id) {
                setAuthorData({
                    name:item.name,
                    profile:item.profile
                })
                setImageUrl(item.image)
                setEditedId(id)
            }
        })
        setModal({ edit: true }, { add: false })
    }

    //cancel form submission
    const onFormCancel = () => {
        setModal({ edit: false, add: false });
        setAuthorData(initial)
    }
    //handle author submission
    const onAuthorSubmit = async (sData) => {
        const {name, profile} = sData
        if ( name === "") {
            return
        }
       let submittedData = {
        id:uuidv4(),
        name:name,
        slug:slugify(name, {lower:true}) + '-'+Date.now(),
        profile:profile,
        image:imageUrl
       }
        //console.log(submittedData)
       await axiosPrivate.post('/post/author/create', submittedData)
       .then(resp => {
        setAuthorData(initial)
        setImageUrl('')
        setAuthors(resp.data.data.response.post_authors)
        setModal({ add: false})
       })
       .catch(err => console.log(err.message))
    }

    const onAuthorUpdate = async (sData) => {
        const {name, profile} = sData
        if (name === "") {
            return
        }
        let submittedData = {
            id:editId,
            name:name,
            profile:profile,
            image:imageUrl
        }
        await axiosPrivate.post('/post/author/update', submittedData)
        .then(resp => {
            setAuthorData(initial)
            setImageUrl('')
            setAuthors(resp.data.data.response.post_authors)
            setModal({ edit: false})
        })
    }

  return (
    <React.Fragment>
        <Head title="Post Attributes"></Head>
        <Content>
            <BlockHead size="lg">
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h4">Post Attributes</BlockTitle>
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
                                            <span>Add Author</span>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            
            <Block>
                <Row className="g-gs">
                    <Col lg="12">
                        <PreviewCard>
                            <OverlineTitle tag="span" className="preview-title-lg mb-3">
                            Author Lists{" "}
                            </OverlineTitle>
                            <DataTable className="card-stretch">
                                <DataTableBody>
                                    <DataTableHead className="nk-tb-item nk-tb-head">
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Author Name</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Description</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Avatar</span>
                                        </DataTableRow>
                                        {/* <DataTableRow size="sm">
                                            <span className="sub-text">Status</span>
                                        </DataTableRow> */}
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Date Added</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span className="sub-text"></span>
                                        </DataTableRow>
                                    </DataTableHead>
                                    {authorsData.length > 0 ? 
                                        authorsData.map((item) => {
                                            return (
                                                <DataTableItem key={item.id}>
                                                    <DataTableRow>
                                                        <span className="sub-text">{item.name}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="sub-text">{item.profile.length > 0 ? item.profile.slice(0, 20) : "N/A"}{item.profile.length > 20 ? "...":""}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="sub-text">{item.image.length > 0 ? item.image.slice(0,25) : "N/A"}{item.image.length > 20 ? "...":""}</span>
                                                    </DataTableRow>
                                                    {/* <DataTableRow>
                                                        <span className="sub-text">Active</span>
                                                    </DataTableRow> */}
                                                    <DataTableRow>
                                                        <span className="sub-text">{momentFormat(item.date_added, "DMY")}</span>
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
                                        }):null}
                                </DataTableBody>
                                <div className="card-inner">
                                {authors.length > 0 ? (
                                    <PaginationComponent
                                        itemPerPage={itemPerPage}
                                        totalItems={authors.length}
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
            {/* <Block>
                <Row className="g-gs">
                    <Col lg="5">
                        <PreviewCard>
                            <OverlineTitle tag="span" className="preview-title-lg mb-3">
                            Add Tag{" "}
                            </OverlineTitle>
                            <Row className="gy-4">
                                <Col sm="12">
                                    <FormGroup>
                                        <Label htmlFor="title" className="form-label">
                                            Tag Name
                                        </Label>
                                        <div className="form-control-wrap">
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            id="title" 
                                            name="title"
                                            //onChange={(e) => onInputChange(e)}
                                            placeholder="Enter Tag Name" 
                                            //ref={register({
                                            //    required: "This field is required",
                                            //})}
                                            />
                                    </div>
                                    </FormGroup>
                                </Col>
                                <Col sm="12">
                                    <FormGroup>
                                        <Label htmlFor="title" className="form-label">
                                            Hot / Not Hot
                                        </Label>
                                        <RSelect 
                                        options={[]} 
                                        //onChange={(e) => setFormData({ ...formData, category: e })} 
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xl="12">
                                    <Button color="primary" size="md">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </PreviewCard>
                    </Col>
                    <Col lg="7">
                        <PreviewCard>
                            <OverlineTitle tag="span" className="preview-title-lg mb-3">
                            Tag Lists{" "}
                            </OverlineTitle>
                            <DataTable className="card-stretch">
                                <DataTableBody>
                                    <DataTableHead className="nk-tb-item nk-tb-head">
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Tag Name</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Tag Slug</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Status</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span className="sub-text">Action</span>
                                        </DataTableRow>
                                    </DataTableHead>
                                    <DataTableItem>
                                        <DataTableRow>
                                            <span>2023Election</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>2023election</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Hot</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
                                                <Icon name="more-h"></Icon>
                                            </DropdownToggle>
                                        </DataTableRow>
                                    </DataTableItem>
                                    <DataTableItem>
                                        <DataTableRow>
                                            <span>2023Election</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>2023election</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Hot</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
                                                <Icon name="more-h"></Icon>
                                            </DropdownToggle>
                                        </DataTableRow>
                                    </DataTableItem>
                                </DataTableBody>
                                <div className="card-inner">
                                <PaginationComponent
                                    // itemPerPage={itemPerPage}
                                    // totalItems={data.length}
                                    // paginate={paginate}
                                    // currentPage={currentPage}
                                />
                                </div>
                            </DataTable>
                        </PreviewCard>
                    </Col>
                </Row>
            </Block> */}
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
                        <h5 className="title">Add Author</h5>
                        <div className="mt-4"> 
                            <Form className="row gy-4" onSubmit={handleSubmit(onAuthorSubmit)}>
                                <Col md="12">
                                    <FormGroup>
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={authorData.name}
                                            placeholder="Enter Author Name"
                                            onChange={(e) => onInputChange(e)}
                                            className="form-control"
                                            ref={register({
                                                required: "This field is required",
                                            })}
                                        />
                                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <FormGroup>
                                    <label className="form-label">Profile</label>
                                    <textarea
                                        name="profile"
                                        defaultValue={authorData.profile}
                                        placeholder="Author profile here..."
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control-xl form-control no-resize"
                                        ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col size="6">
                                    <div className="form-control-wrap">
                                        <label className="form-label">Upload Avatar</label>
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
                                <Col size="6">
                                    <FormGroup>
                                    <label className="form-label">Image Link</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={imageUrl}
                                        placeholder="Enter Image URL or Icon class"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                    <li>
                                        <Button color="primary" size="md" type="submit">
                                            Add Author
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
                        <h5 className="title">Update Author</h5>
                        <div className="mt-4"> 
                            <Form className="row gy-4" onSubmit={handleSubmit(onAuthorUpdate)}>
                                <Col md="12">
                                    <FormGroup>
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={authorData.name}
                                            placeholder="Enter Author Name"
                                            onChange={(e) => onInputChange(e)}
                                            className="form-control"
                                            ref={register({
                                                required: "This field is required",
                                            })}
                                        />
                                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <FormGroup>
                                    <label className="form-label">Profile</label>
                                    <textarea
                                        name="profile"
                                        defaultValue={authorData.profile}
                                        placeholder="Author profile here..."
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control-xl form-control no-resize"
                                        ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col size="6">
                                    <div className="form-control-wrap">
                                        <label className="form-label">Upload Avatar</label>
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
                                <Col size="6">
                                    <FormGroup>
                                    <label className="form-label">Image Link</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={imageUrl}
                                        placeholder="Enter Image URL or Icon class"
                                        onChange={(e) => onInputChange(e)}
                                        className="form-control"
                                        ref={register()}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                    <li>
                                        <Button color="primary" size="md" type="submit">
                                            Update Author
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

export default Attributes