import React, {useRef, useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { FormGroup, Label, Spinner, Row, Col } from "reactstrap";
import { Editor } from "@tinymce/tinymce-react";

const unique = require("array-unique")
import {
    Button,
    Block,
    BlockBetween,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    PreviewCard,
    OverlineTitle,
    RSelect
  } from "../../../components/Component";
  import { useForm } from "react-hook-form";
  import { v4 as uuidv4 } from "uuid"
  import slugify from "slugify";
  import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

function CreatePost() {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const initial = {
        title:"",
        category:null,
        type:null,
        content:"",
        media:"",
        keywords:[],
        author:"Admin",
        meta_title:"",
        meta_keywords:"",
        meta_desc:"",
        pub_date:Date.now()
    }
    const [formData, setFormData] = useState(initial)
    const [defaultFiles, setDefaultFiles] = useState("")
    const [selected, setSelected] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [catOptions, setCatOptions] = useState()
    const [featured, setFeatured] = useState(false)
    const [facebook, setFacebook] = useState(false)
    const [slider, setSlider] = useState(false)
    const [popular, setPopular] = useState(false)
    const [editor, setEditor] = useState(false)


    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getCategories = async () => {
            const response = await axiosPrivate.get('/category/pull', {
                signal: controller.signal
            })
            if (isMounted && response.data.data.categories) {
                const data = response.data.data.categories, catList = []
                data.filter((item) => {
                    isMounted && catList.push({value:item.slug, label:item.label})
                })
                setCatOptions(catList)
            }
        }
        getCategories()

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [])

    const Types = [
        {value:"Article", label:"Article"},
        {value:"Podcast", label:"Podcast"},
        {value:"Video", label:"Video"}
    ]

    const tags = [
        {value:"Enugu", label:"Enugu"},
        {value:"2023Election", label:"2023Election"}
    ]

    // OnChange function to get the input data
    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 
    const onFormSubmit = async () => { 
        const {title, category, type, content} = formData
        if (title == "" || content == "" || !category.value || !type.value) {
            return
        }
        let submittedData = {
            id:uuidv4(),
            title:formData.title,
            slug:slugify(formData.title, {lower:true}) + '-'+Date.now(),
            category:formData.category,
            type:formData.type,
            content:formData.content,
            short_content:formData.short_content,
            image:imageUrl,
            keywords:formData.keywords,
            post_settings:{
                featured:featured,
                slider:slider,
                popular:popular,
                editor:editor,
                facebook:facebook
            },
            seo:{
                title:formData.meta_title,
                keywords:unique(formData.meta_keywords.replace(" ","").split(",")),
                description:formData.meta_desc
            },
            status:1,
            author:formData.author,
            pub_date:formData.pub_date
        }
        await axiosPrivate.post('/post/create', submittedData)
        .then(resp => {
            setFormData(initial)
            setImageUrl('')
            navigate("/dashboard/post/list")
        })
        .catch(err => {
            console.log(err.response)
        })
    }

    // handles ondrop function of dropzone
    const handleImageInput = (e) => {
        const file = e.target.files[0]
        base64Encode(file)
        setSelected(e.target.value)
    };

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

    const editorRef = useRef(null);
    const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Add Post" />
      <Content>
      <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Add Post</BlockTitle>
              <BlockDes className="text-soft">
                <p>Create new post content</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block size="lg">
            <Row className="g-gs">
                <Col lg="8">
                    <PreviewCard>
                        <OverlineTitle tag="span" className="preview-title-lg mb-3">
                        {" "}
                        Content{" "}
                        </OverlineTitle>
                        <Row className="gy-4">
                            <Col sm="12">
                                <FormGroup>
                                    <Label htmlFor="title" className="form-label">
                                        Post Title
                                    </Label>
                                    <div className="form-control-wrap">
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            id="title" 
                                            name="title"
                                            onChange={(e) => onInputChange(e)}
                                            placeholder="Enter Post Title" 
                                            ref={register({
                                                required: "This field is required",
                                            })}
                                            />
                                            {errors.title && <span className="invalid">{errors.title.message}</span>}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label className="form-label">Category</label>
                                    <RSelect 
                                        options={catOptions} 
                                        onChange={(e) => setFormData({ ...formData, category: e })} 
                                        />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label className="form-label">Type</label>
                                    <RSelect options={Types} onChange={(e) => setFormData({ ...formData, type:e })} />
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label htmlFor="excerpt" className="form-label">
                                        Excerpt
                                    </Label>
                                    <div className="form-control-wrap">
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            id="excerpt" 
                                            name="short_content"
                                            onChange={(e) => onInputChange(e)}
                                            placeholder="short description of content" />
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <label className="form-label">Content</label>
                                <Editor
                                    onInit={(evt, editor) => (editorRef.current = editor)}
                                    initialValue="<p></p>"
                                    onEditorChange={(e) => setFormData({...formData, content:e})}
                                    init={{
                                        menubar: false,
                                        plugins: [
                                        "advlist autolink lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table paste code",
                                        ],
                                        toolbar:
                                        "undo redo | formatselect | " +
                                        "bold italic | alignleft aligncenter " +
                                        "alignright alignjustify | outdent indent",
                                    }}
                                />
                                {errors.content && <span className="invalid">{errors.content.message}</span>}
                            </Col>
                        </Row>
                    </PreviewCard>
                    <PreviewCard>
                        <OverlineTitle tag="span" className="preview-title-lg mb-3">
                        {" "}
                        Post Settings{" "}
                        </OverlineTitle>
                        {/* <div className="card-head">
                            <h5 className="card-title">MEDIA</h5>
                        </div> */}
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <FormGroup>
                                    <label className="form-label" htmlFor="media">
                                        Add Media
                                    </label>
                                    <span className="form-note">Select/Add file to be uploaded.</span>
                                </FormGroup>
                            </Col>
                            <Col md="7">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <div className="custom-file">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="customFile"
                                            onChange={(e) => setDefaultFiles()}
                                        />
                                        <label className="custom-file-label" htmlFor="customFile">
                                            {defaultFiles === "" ? "Choose files" : defaultFiles}
                                        </label>
                                        </div>
                                    </div>
                                </div>
                            </Col> 
                        </Row>
                        <Row className="g-3 align-center">
                            <Col md="5">
                                <FormGroup>
                                    <label className="form-label" htmlFor="author">
                                        Post Author
                                    </label>
                                    <span className="form-note">Specify the name of author.</span>
                                </FormGroup>
                            </Col>
                            <Col lg="7">
                                <FormGroup>
                                    <div className="form-control-wrap">
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        className="form-control"
                                        defaultValue="Admin"
                                        onChange={(e) => onInputChange(e)}
                                        placeholder="Post Author"
                                    />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col md="5">
                                <FormGroup>
                                    <label className="form-label" htmlFor="keywords">
                                        Post Tags
                                    </label>
                                    <span className="form-note">Select post tags </span>
                                </FormGroup>
                            </Col>
                            <Col lg="7">
                                <FormGroup>
                                <RSelect
                                    options={tags}
                                    isMulti
                                    defaultValue={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e })}
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="card-head mt-3">
                            <h5 className="card-title">SEO</h5>
                        </div>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <FormGroup>
                                    <label className="form-label" htmlFor="meta-title">
                                        Meta Title
                                    </label>
                                    <span className="form-note">Provide meta title for post.</span>
                                </FormGroup>
                            </Col>
                            <Col lg="7">
                                <FormGroup>
                                    <div className="form-control-wrap">
                                    <input
                                        type="text"
                                        id="meta-title"
                                        name="meta_title"
                                        className="form-control"
                                        onChange={(e) => onInputChange(e)}
                                        placeholder="Meta title"
                                    />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <FormGroup>
                                    <label className="form-label" htmlFor="meta-keywords">
                                        Meta Keywords
                                    </label>
                                    <span className="form-note">Provide meta keywords for post.</span>
                                </FormGroup>
                            </Col>
                            <Col lg="7">
                                <FormGroup>
                                    <div className="form-control-wrap">
                                    <input
                                        type="text"
                                        id="meta-keywords"
                                        name="meta_keywords"
                                        className="form-control"
                                        onChange={(e) => onInputChange(e)}
                                        placeholder="Meta keywords"
                                    />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <FormGroup>
                                    <label className="form-label" htmlFor="meta-description">
                                        Meta Description
                                    </label>
                                    <span className="form-note">Provide meta description for post.</span>
                                </FormGroup>
                            </Col>
                            <Col lg="7">
                                <FormGroup>
                                    <div className="form-control-wrap">
                                        <textarea
                                            className="form-control form-control-sm"
                                            id="meta-description"
                                            name="meta_desc"
                                            onChange={(e) => onInputChange(e)}
                                            placeholder="Meta Description (max: 300 characters)"
                                        ></textarea>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </PreviewCard>
                </Col>
                <Col lg="4">
                    <Block size="md">
                        <PreviewCard>
                            <OverlineTitle tag="span" className="preview-title-lg mb-3">
                            Attributes{" "}
                            </OverlineTitle>
                            <Row className="g-3">
                                <Col lg="5">
                                    <FormGroup>
                                        <label className="form-label" htmlFor="featured">
                                        Featured
                                        </label>
                                    </FormGroup>
                                </Col>
                                <Col lg="7" style={{"position": "relative","left": "58px"}}>
                                    <FormGroup>
                                        <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            onChange={() => setFeatured(!featured)}
                                            id="featured"
                                        />
                                        <label className="custom-control-label" htmlFor="featured"></label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="g-3">
                                <Col lg="5">
                                    <FormGroup>
                                        <label className="form-label" htmlFor="slider">
                                        Slider
                                        </label>
                                    </FormGroup>
                                </Col>
                                <Col lg="7" style={{"position": "relative","left": "58px"}}>
                                    <FormGroup>
                                        <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            onChange={() => setSlider(!slider)}
                                            id="slider"
                                        />
                                        <label className="custom-control-label" htmlFor="slider"></label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="g-3">
                                <Col lg="5">
                                    <FormGroup>
                                        <label className="form-label" htmlFor="popular">
                                        Popular
                                        </label>
                                    </FormGroup>
                                </Col>
                                <Col lg="7" style={{"position": "relative","left": "58px"}}>
                                    <FormGroup>
                                        <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            onChange={() => setPopular(!popular)}
                                            id="popular"
                                        />
                                        <label className="custom-control-label" htmlFor="popular"></label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="g-3">
                                <Col lg="5">
                                    <FormGroup>
                                        <label className="form-label" htmlFor="editor">
                                        Editor
                                        </label>
                                    </FormGroup>
                                </Col>
                                <Col lg="7" style={{"position": "relative","left": "58px"}}>
                                    <FormGroup>
                                        <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            onChange={() => setEditor(!editor)}
                                            id="editor"
                                        />
                                        <label className="custom-control-label" htmlFor="editor"></label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <OverlineTitle tag="span" className="preview-title-lg mt-3">
                                Socials{" "}
                            </OverlineTitle>
                            <Row className="g-3">
                                <Col lg="5">
                                    <FormGroup>
                                        <label className="form-label" htmlFor="facebook">
                                        Facebook
                                        </label>
                                    </FormGroup>
                                </Col>
                                <Col lg="7" style={{"position": "relative","left": "58px"}}>
                                    <FormGroup>
                                        <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            onChange={() => setFacebook(!facebook)}
                                            id="facebook"
                                        />
                                        <label className="custom-control-label" htmlFor="facebook"></label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            {/* <Row className="g-3">
                                <Col lg="5">
                                    <FormGroup>
                                        <label className="form-label" htmlFor="twitter">
                                        Twitter
                                        </label>
                                    </FormGroup>
                                </Col>
                                <Col lg="7" style={{"position": "relative","left": "58px"}}>
                                    <FormGroup>
                                        <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            onChange={() => setTwitter(!twitter)}
                                            id="facebook"
                                        />
                                        <label className="custom-control-label" htmlFor="twitter"></label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row> */}
                    
                            <Row className="mt-4">
                                <Col xl="12">
                                    <Button color="primary" size="md" onClick={handleSubmit(onFormSubmit)}>
                                        Publish
                                    </Button>
                                </Col>
                            </Row>
                        </PreviewCard>
                        <PreviewCard>
                            <OverlineTitle tag="span" className="preview-title-lg">
                                Cover Image{" "}
                            </OverlineTitle>
                            <Row size="12">
                                <Col>
                                    <img src={imageUrl ? imageUrl : "https://react.dashlite.net/demo1/static/media/b.ab88cd7174e0ef667479.jpg"} alt="preview" />
                                </Col>
                            </Row>
                            <Row size="12">
                                <Col size="6">
                                    <div className="form-control-wrap mt-3">
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
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xl="12">
                                    <Button color="primary" size="md" onClick={uploadImage}>
                                        Upload
                                    </Button>
                                </Col>
                            </Row>
                        </PreviewCard>
                    </Block>
                </Col>
            </Row>
        </Block>
      </Content>
    </React.Fragment>
  )
}

export default CreatePost