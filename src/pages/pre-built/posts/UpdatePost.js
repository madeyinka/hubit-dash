import React, {useEffect, useState} from 'react'
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { FormGroup, Label, Row, Col } from "reactstrap";
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { modules, formats } from "../../../components/partials/react-quill/EditorToolbar";
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
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useParams, useNavigate} from 'react-router-dom'

function UpdatePost() {
    const { id } = useParams()
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()
    const [data, setData] = useState({})
    const [formData, setFormData] = useState()
    const [catOptions, setCatOptions] = useState()
    const [content, setContent] = useState('')
    const [featured, setFeatured] = useState(false)
    const [facebook, setFacebook] = useState(false)
    const [slider, setSlider] = useState(false)
    const [popular, setPopular] = useState(false)
    const [editor, setEditor] = useState(false)
    const [selected, setSelected] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [defaultFiles, setDefaultFiles] = useState("")

    const { errors, register, handleSubmit } = useForm();

    //useEffects
    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()
        const getPost = async () => {
            const response = await axiosPrivate.get('/post/pull', {
                signal:controller.signal
            })
            if (isMounted && response.data.data) {
                const posts = response.data.data.posts
                posts.forEach((item) => {
                    if (item.id === id) {
                        setData({
                            title:item.title,
                            category:item.category,
                            type:item.type,
                            short_content:item.short_content,
                            keywords:item.keywords,
                            author:item.author,
                            meta_title:item.seo.title,
                            meta_keywords:item.seo.keywords,
                            meta_desc:item.seo.description
                        })
                        setContent(item.content)
                        setPopular(item.post_settings.popular)
                        setFeatured(item.post_settings.featured)
                        setSlider(item.post_settings.slider)
                        setEditor(item.post_settings.editor)
                        setFacebook(item.post_settings.facebook)
                        setImageUrl(item.image)
                    }
                })
            }
        }
        getPost()
        return () => {
            isMounted = false
            controller.abort()
        }
    }, [axiosPrivate, id])

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
                           return  isMounted && catList.push({value:item.slug, label:item.label})
                        })
                        setCatOptions(catList)
                    }
                }
                getCategories()
                return () => {
                    isMounted = false
                    controller.abort()
                }
            }, [axiosPrivate])
    
    const Types = [
                {value:"Article", label:"Article"},
                {value:"Podcast", label:"Podcast"},
                {value:"Video", label:"Video"}
            ]

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

    const onFormSubmit = async () => {
        let submittedData = {
            id:id,
            title: formData?.title ? formData.title : data.title,
            category: formData?.category ? formData.category : data.category,
            type: formData?.type ? formData.type : data.type,
            short_content: formData?.short_content ? formData.short_content : data.short_content,
            content: formData?.content ? formData.content : content,
            keywords:formData?.keywords ? formData.keyword : data.keywords,
            author: formData?.author ? formData.author : data.author,
            image: imageUrl,
            post_settings:{
                featured:featured,
                slider:slider,
                popular:popular,
                editor:editor,
                facebook:facebook
            },
            seo:{
                title: formData?.meta_title ? formData.meta_title : data.meta_title,
                keywords: formData?.meta_keywords ? formData.meta_keywords : data.meta_keywords,
                description: formData?.meta_desc ? formData.meta_desc : data.meta_desc
            },
            status:1,
            pub_date:formData.pub_date,
            date_modified:Date.now()
        }
        await axiosPrivate.post('/post/update', submittedData)
        .then(resp => {
            setImageUrl('')
            setFormData(null)
            navigate("/dashboard/post/list")
        })
    }

  return (
    <React.Fragment>
        <Head title="Update Post" />
        <Content>
        <BlockHead size="sm">
             <BlockBetween>
                 <BlockHeadContent>
                 <BlockTitle page>Update Post</BlockTitle>
                 <BlockDes className="text-soft">
                     <p>Edit post content</p>
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
                            Content
                        </OverlineTitle>
                        <Row className="gy-4">
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="title" className="form-label">
                                    Post Title
                                </Label>
                                <div className="form-control-wrap">
                                    <input 
                                        type="text" 
                                        id="title" 
                                        className="form-control" 
                                        name="title"
                                        defaultValue={data.title}
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
                            {data.category && <FormGroup>
                                <label className="form-label">Category</label>
                                <RSelect 
                                    options={catOptions} 
                                    defaultValue={data.category}
                                    onChange={(e) => setFormData({ ...formData, category: e })} 
                                />
                            </FormGroup>}
                        </Col>
                        <Col md="6">
                            {data.type && <FormGroup>
                                <label className="form-label">Type</label>
                                <RSelect 
                                    options={Types} 
                                    defaultValue={data.type}
                                    onChange={(e) => setFormData({ ...formData, type:e })} 
                                />
                            </FormGroup>}
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
                                        defaultValue={data.short_content}
                                        onChange={(e) => onInputChange(e)}
                                        placeholder="short description of content" />
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="12">
                            <FormGroup>
                                <label className="form-label">Content</label>
                                <EditorToolbar toolbarId={'t1'}/>
                                <ReactQuill 
                                    theme="snow"
                                    value={content}
                                    placeholder="Text editor content..."
                                    onChange={(e) => {setContent(e); setFormData({...formData, "content":e})}}
                                    modules={modules('t1')}
                                    formats={formats}
                                    style={{ width: "100%", height: "250px" }}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    </PreviewCard>
                    <PreviewCard>
                    <OverlineTitle tag="span" className="preview-title-lg mb-3">
                        Post Settings{" "}
                    </OverlineTitle>
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
                                        defaultValue={data.author}
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
                                    options={[]}
                                    isMulti
                                    value={data.keywords}
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
                                        defaultValue={data.meta_title}
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
                                        defaultValue={data.meta_keywords}
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
                                        defaultValue={data.meta_desc}
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
                                            checked={featured}
                                            onChange={() => {setFeatured(!featured); setFormData({...formData, "featured":!featured})}}
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
                                            checked={slider}
                                            onChange={() => {setSlider(!slider); setFormData({...formData, "slider":!slider})}}
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
                                            checked={popular}
                                            onChange={() => {setPopular(!popular); setFormData({...formData, "popular":!popular})}}
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
                                            checked={editor}
                                            onChange={() => {setEditor(!editor); setFormData({...formData, "editor":!editor})}}
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
                                            checked={facebook}
                                            onChange={() => {setFacebook(!facebook); setFormData({...formData, "facebook":!facebook})}}
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

export default UpdatePost







// import React, {useState, useEffect} from 'react'
// import {useNavigate, useParams} from "react-router-dom"
// import Content from "../../../layout/content/Content";
// import Head from "../../../layout/head/Head";
// import { FormGroup, Label, Row, Col } from "reactstrap";
// import ReactQuill from "react-quill"
// import "react-quill/dist/quill.snow.css";
// import EditorToolbar, { modules, formats } from "../../../components/partials/react-quill/EditorToolbar";
// import {
//     Button,
//     Block,
//     BlockBetween,
//     BlockDes,
//     BlockHead,
//     BlockHeadContent,
//     BlockTitle,
//     PreviewCard,
//     OverlineTitle,
//     RSelect
//   } from "../../../components/Component";
//   import { useForm } from "react-hook-form";
//   import slugify from "slugify";
//   import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
//   //const unique = require("array-unique")

// function UpdatePost() {
//     const axiosPrivate = useAxiosPrivate()
//     const navigate = useNavigate()
//     const { id } = useParams()

//     const [formData, setFormData] = useState({})
//     const [defaultFiles, setDefaultFiles] = useState("")
//     const [selected, setSelected] = useState('')
//     const [imageUrl, setImageUrl] = useState('')
//     const [imagePreview, setImagePreview] = useState('')
//     const [catOptions, setCatOptions] = useState()
//     const [featured, setFeatured] = useState(false)
//     const [facebook, setFacebook] = useState(false)
//     const [slider, setSlider] = useState(false)
//     const [popular, setPopular] = useState(false)
//     const [editor, setEditor] = useState(false)

//     const { errors, register, handleSubmit } = useForm();
//     //const unique = require("array-unique")
//     useEffect(() => {
//         let isMounted = true
//         const controller = new AbortController()
//         const getCategories = async () => {
//             const response = await axiosPrivate.get('/category/pull', {
//                 signal: controller.signal
//             })
//             if (isMounted && response.data.data.categories) {
//                 const data = response.data.data.categories, catList = []
//                 data.filter((item) => {
//                    return  isMounted && catList.push({value:item.slug, label:item.label})
//                 })
//                 setCatOptions(catList)
//             }
//         }
//         getCategories()
//         return () => {
//             isMounted = false
//             controller.abort()
//         }
//     }, [axiosPrivate])

//     //get formValue for selected item
//     useEffect(() => {
//         let isMounted = true
//         const controller = new AbortController()
//         const getPost = async () => {
//             const response = await axiosPrivate.get('/post/pull', {
//                 signal:controller.signal
//             })
//             if (isMounted) {
//                 const data = response.data?.data?.posts
//                 data.forEach((item) => {
//                     if (item.id === id) {
//                         setFormData({
//                             title:item.title,
//                             category:item.category,
//                             type:item.type,
//                             short_content:item.short_content,
//                             content:item.content,
//                             keywords:item.keywords,
//                             author:item.author,
//                             meta_title:item.seo.meta_title,
//                             meta_keywords:item.seo.meta_keywords,
//                             meta_desc:item.seo.meta_description

//                         })
//                         setImageUrl(item.image)
//                         setFeatured(item.post_settings.featured)
//                         setSlider(item.post_settings.slider)
//                         setPopular(item.post_settings.popular)
//                         setEditor(item.post_settings.editor)
//                         setFacebook(item.post_settings.facebook)
//                     }
//                 })
//             }
//         }
//         getPost()
//         return () => {
//             isMounted = false
//             controller.abort()
//         }
//     },[id, axiosPrivate])

//     // OnChange function to get the input data
//     const onInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleImageInput = (e) => {
//         const file = e.target.files[0]
//         base64Encode(file)
//         setSelected(e.target.value)
//     }

//     const base64Encode = (file) => {
//         const reader = new FileReader()
//         reader.readAsDataURL(file)
//         reader.onloadend = () => {
//             setImagePreview(reader.result)
//         }
//     }

//     const uploadImage = async (e) => {
//         e.preventDefault()
//         if (!imagePreview) return;
//         const data = {data:imagePreview}
//         try {
//             await axiosPrivate.post('/assets/upload-to-cloud', data)
//             .then(response => {
//                 setSelected('')
//                 setImageUrl(response.data.url)
//             })
//         } catch (e) {
//             console.log(e)
//         }
//     }

//     //post type options
//     const Types = [
//         {value:"Article", label:"Article"},
//         {value:"Podcast", label:"Podcast"},
//         {value:"Video", label:"Video"}
//     ]

//     //handle form submission
//     const onFormSubmit = async (sData) => {
//         const {title, category, type, content} = formData
//         if (title === "" || content === "" || !category.value || !type.value) {
//             return
//         }
//         let submittedData = {
//             id:id,
//             title:formData.title,
//             slug:slugify(formData.title, {lower:true}) + '-'+Date.now(),
//             category:formData.category,
//             type:formData.type,
//             content:formData.content,
//             short_content:formData.short_content,
//             image:imageUrl,
//             keywords:formData.keywords,
//             post_settings: {
//                 featured:featured,
//                 slider:slider,
//                 popular:popular,
//                 editor:editor,
//                 facebook:facebook
//             },
//             seo:{
//                 title:formData.meta_title,
//                 //keywords:unique(formData.meta_keywords.replace(" ","").split(",")),
//                 description:formData.meta_desc
//             },
//             status:1,
//             author:formData.author,
//             pub_date:formData.pub_date
//         }
//         await axiosPrivate.post('/post/update', submittedData)
//         .then(resp => {
//            //setFormData(null)
//             setImageUrl('')
//             navigate("/dashboard/post/list")
//         })
//         .catch(err => console.log(err.response))
//     }

//   return (
//     <React.Fragment>
//         <Head title="Update Post" />
//         <Content>
//         <BlockHead size="sm">
//             <BlockBetween>
//                 <BlockHeadContent>
//                 <BlockTitle page>Update Post</BlockTitle>
//                 <BlockDes className="text-soft">
//                     <p>Edit post content</p>
//                 </BlockDes>
//                 </BlockHeadContent>
//                 <BlockHeadContent>
                
//                 </BlockHeadContent>
//             </BlockBetween>
//         </BlockHead>
//         <Block size="lg">
//             <Row className="g-gs">
//                 <Col lg="8">
//                     <PreviewCard>
//                         <OverlineTitle tag="span" className="preview-title-lg mb-3">
//                         {" "}
//                         Content{" "}
//                         </OverlineTitle>
//                         <Row className="gy-4">
//                             <Col sm="12">
//                                 <FormGroup>
//                                     <Label htmlFor="title" className="form-label">
//                                         Post Title
//                                     </Label>
//                                     <div className="form-control-wrap">
//                                         <input 
//                                             className="form-control" 
//                                             type="text" 
//                                             id="title" 
//                                             name="title"
//                                             value={formData?.title}
//                                             onChange={(e) => onInputChange(e)}
//                                             placeholder="Enter Post Title" 
//                                             ref={register({
//                                                 required: "This field is required",
//                                             })}
//                                             />
//                                             {errors.title && <span className="invalid">{errors.title.message}</span>}
//                                     </div>
//                                 </FormGroup>
//                             </Col>
//                             <Col md="6">
//                                 <FormGroup>
//                                     <label className="form-label">Category</label>
//                                     <RSelect  
//                                         value={formData?.category}
//                                         onChange={(e) => setFormData({ ...formData, category: e })}
//                                         options={catOptions} 
//                                     />
//                                 </FormGroup>
//                             </Col>
//                             <Col md="6">
//                                 <FormGroup>
//                                     <label className="form-label">Type</label>
//                                     <RSelect 
//                                     options={Types} 
//                                     value={formData?.type}
//                                     onChange={(e) => setFormData({ ...formData, type:e })} />
//                                 </FormGroup>
//                             </Col>
//                             <Col md="12">
//                                 <FormGroup>
//                                     <Label htmlFor="excerpt" className="form-label">
//                                         Excerpt
//                                     </Label>
//                                     <div className="form-control-wrap">
//                                         <input 
//                                             className="form-control" 
//                                             type="text" 
//                                             id="excerpt" 
//                                             name="short_content"
//                                             value={formData?.short_content}
//                                             onChange={(e) => onInputChange(e)}
//                                             placeholder="short description of content" />
//                                     </div>
//                                 </FormGroup>
//                             </Col>
//                             <Col md="12">
//                                 <FormGroup>
//                                     <label className="form-label">Content</label>
//                                     <EditorToolbar toolbarId={'t1'}/>
//                                     <ReactQuill 
//                                         theme="snow"
//                                         placeholder="Text editor content..."
//                                         onChange={(e) => setFormData({...formData, content:e})}
//                                         modules={modules('t1')}
//                                         formats={formats}
//                                         value={formData?.content}
//                                         style={{ width: "100%", height: "100%" }}
//                                     />
//                                 </FormGroup>
//                             </Col>
//                         </Row>
//                     </PreviewCard>
//                     <PreviewCard>
//                         <OverlineTitle tag="span" className="preview-title-lg mb-3">
//                         {" "}
//                         Post Settings{" "}
//                         </OverlineTitle>
//                         <Row className="g-3 align-center">
//                             <Col lg="5">
//                                 <FormGroup>
//                                     <label className="form-label" htmlFor="media">
//                                         Add Media
//                                     </label>
//                                     <span className="form-note">Select/Add file to be uploaded.</span>
//                                 </FormGroup>
//                             </Col>
//                             <Col md="7">
//                                 <div className="form-group">
//                                     <div className="form-control-wrap">
//                                         <div className="custom-file">
//                                         <input
//                                             type="file"
//                                             className="custom-file-input"
//                                             id="customFile"
//                                             onChange={(e) => setDefaultFiles()}
//                                         />
//                                         <label className="custom-file-label" htmlFor="customFile">
//                                             {defaultFiles === "" ? "Choose files" : defaultFiles}
//                                         </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Col> 
//                         </Row>
//                         <Row className="g-3 align-center">
//                             <Col md="5">
//                                 <FormGroup>
//                                     <label className="form-label" htmlFor="author">
//                                         Post Author
//                                     </label>
//                                     <span className="form-note">Specify the name of author.</span>
//                                 </FormGroup>
//                             </Col>
//                             <Col lg="7">
//                                 <FormGroup>
//                                     <div className="form-control-wrap">
//                                     <input
//                                         type="text"
//                                         id="author"
//                                         name="author"
//                                         className="form-control"
//                                         value={formData?.author}
//                                         onChange={(e) => onInputChange(e)}
//                                         placeholder="Post Author"
//                                     />
//                                     </div>
//                                 </FormGroup>
//                             </Col>
//                         </Row>
//                         <Row className="g-3 align-center">
//                             <Col md="5">
//                                 <FormGroup>
//                                     <label className="form-label" htmlFor="keywords">
//                                         Post Tags
//                                     </label>
//                                     <span className="form-note">Select post tags </span>
//                                 </FormGroup>
//                             </Col>
//                             <Col lg="7">
//                                 <FormGroup>
//                                 <RSelect
//                                     options={[]}
//                                     isMulti
//                                     value={formData?.keywords}
//                                     onChange={(e) => setFormData({ ...formData, keywords: e })}
//                                 />
//                                 </FormGroup>
//                             </Col>
//                         </Row>
//                         <div className="card-head mt-3">
//                             <h5 className="card-title">SEO</h5>
//                         </div>
//                         <Row className="g-3 align-center">
//                             <Col lg="5">
//                                 <FormGroup>
//                                     <label className="form-label" htmlFor="meta-title">
//                                         Meta Title
//                                     </label>
//                                     <span className="form-note">Provide meta title for post.</span>
//                                 </FormGroup>
//                             </Col>
//                             <Col lg="7">
//                                 <FormGroup>
//                                     <div className="form-control-wrap">
//                                     <input
//                                         type="text"
//                                         id="meta-title"
//                                         name="meta_title"
//                                         className="form-control"
//                                         value={formData?.seo?.meta_title}
//                                         onChange={(e) => onInputChange(e)}
//                                         placeholder="Meta title"
//                                     />
//                                     </div>
//                                 </FormGroup>
//                             </Col>
//                         </Row>
//                         <Row className="g-3 align-center">
//                             <Col lg="5">
//                                 <FormGroup>
//                                     <label className="form-label" htmlFor="meta-keywords">
//                                         Meta Keywords
//                                     </label>
//                                     <span className="form-note">Provide meta keywords for post.</span>
//                                 </FormGroup>
//                             </Col>
//                             <Col lg="7">
//                                 <FormGroup>
//                                     <div className="form-control-wrap">
//                                     <input
//                                         type="text"
//                                         id="meta-keywords"
//                                         name="meta_keywords"
//                                         className="form-control"
//                                         value={formData?.seo?.meta_keywords}
//                                         onChange={(e) => onInputChange(e)}
//                                         placeholder="Meta keywords"
//                                     />
//                                     </div>
//                                 </FormGroup>
//                             </Col>
//                         </Row>
//                         <Row className="g-3 align-center">
//                             <Col lg="5">
//                                 <FormGroup>
//                                     <label className="form-label" htmlFor="meta-description">
//                                         Meta Description
//                                     </label>
//                                     <span className="form-note">Provide meta description for post.</span>
//                                 </FormGroup>
//                             </Col>
//                             <Col lg="7">
//                                 <FormGroup>
//                                     <div className="form-control-wrap">
//                                         <textarea
//                                             className="form-control form-control-sm"
//                                             id="meta-description"
//                                             name="meta_desc"
//                                             value={formData?.seo?.meta_desc}
//                                             onChange={(e) => onInputChange(e)}
//                                             placeholder="Meta Description (max: 300 characters)"
//                                         ></textarea>
//                                     </div>
//                                 </FormGroup>
//                             </Col>
//                         </Row>
//                     </PreviewCard>
//                 </Col>
                // <Col lg="4">
                //     <Block size="md">
                //         <PreviewCard>
                //             <OverlineTitle tag="span" className="preview-title-lg mb-3">
                //             Attributes{" "}
                //             </OverlineTitle>
                //             <Row className="g-3">
                //                 <Col lg="5">
                //                     <FormGroup>
                //                         <label className="form-label" htmlFor="featured">
                //                         Featured
                //                         </label>
                //                     </FormGroup>
                //                 </Col>
                //                 <Col lg="7" style={{"position": "relative","left": "58px"}}>
                //                     <FormGroup>
                //                         <div className="custom-control custom-switch">
                //                         <input
                //                             type="checkbox"
                //                             className="custom-control-input form-control"
                //                             checked={featured}
                //                             onChange={() => setFeatured(!featured)}
                //                             id="featured"
                //                         />
                //                         <label className="custom-control-label" htmlFor="featured"></label>
                //                         </div>
                //                     </FormGroup>
                //                 </Col>
                //             </Row>
                //             <Row className="g-3">
                //                 <Col lg="5">
                //                     <FormGroup>
                //                         <label className="form-label" htmlFor="slider">
                //                         Slider
                //                         </label>
                //                     </FormGroup>
                //                 </Col>
                //                 <Col lg="7" style={{"position": "relative","left": "58px"}}>
                //                     <FormGroup>
                //                         <div className="custom-control custom-switch">
                //                         <input
                //                             type="checkbox"
                //                             className="custom-control-input form-control"
                //                             checked={slider}
                //                             onChange={() => setSlider(!slider)}
                //                             id="slider"
                //                         />
                //                         <label className="custom-control-label" htmlFor="slider"></label>
                //                         </div>
                //                     </FormGroup>
                //                 </Col>
                //             </Row>
                //             <Row className="g-3">
                //                 <Col lg="5">
                //                     <FormGroup>
                //                         <label className="form-label" htmlFor="popular">
                //                         Popular
                //                         </label>
                //                     </FormGroup>
                //                 </Col>
                //                 <Col lg="7" style={{"position": "relative","left": "58px"}}>
                //                     <FormGroup>
                //                         <div className="custom-control custom-switch">
                //                         <input
                //                             type="checkbox"
                //                             className="custom-control-input form-control"
                //                             checked={popular}
                //                             onChange={() => setPopular(!popular)}
                //                             id="popular"
                //                         />
                //                         <label className="custom-control-label" htmlFor="popular"></label>
                //                         </div>
                //                     </FormGroup>
                //                 </Col>
                //             </Row>
                //             <Row className="g-3">
                //                 <Col lg="5">
                //                     <FormGroup>
                //                         <label className="form-label" htmlFor="editor">
                //                         Editor
                //                         </label>
                //                     </FormGroup>
                //                 </Col>
                //                 <Col lg="7" style={{"position": "relative","left": "58px"}}>
                //                     <FormGroup>
                //                         <div className="custom-control custom-switch">
                //                         <input
                //                             type="checkbox"
                //                             className="custom-control-input form-control"
                //                             checked={editor}
                //                             onChange={() => setEditor(!editor)}
                //                             id="editor"
                //                         />
                //                         <label className="custom-control-label" htmlFor="editor"></label>
                //                         </div>
                //                     </FormGroup>
                //                 </Col>
                //             </Row>
                //             <OverlineTitle tag="span" className="preview-title-lg mt-3">
                //                 Socials{" "}
                //             </OverlineTitle>
                //             <Row className="g-3">
                //                 <Col lg="5">
                //                     <FormGroup>
                //                         <label className="form-label" htmlFor="facebook">
                //                         Facebook
                //                         </label>
                //                     </FormGroup>
                //                 </Col>
                //                 <Col lg="7" style={{"position": "relative","left": "58px"}}>
                //                     <FormGroup>
                //                         <div className="custom-control custom-switch">
                //                         <input
                //                             type="checkbox"
                //                             className="custom-control-input form-control"
                //                             checked={facebook}
                //                             onChange={() => setFacebook(!facebook)}
                //                             id="facebook"
                //                         />
                //                         <label className="custom-control-label" htmlFor="facebook"></label>
                //                         </div>
                //                     </FormGroup>
                //                 </Col>
                //             </Row>
                //             {/* <Row className="g-3">
                //                 <Col lg="5">
                //                     <FormGroup>
                //                         <label className="form-label" htmlFor="twitter">
                //                         Twitter
                //                         </label>
                //                     </FormGroup>
                //                 </Col>
                //                 <Col lg="7" style={{"position": "relative","left": "58px"}}>
                //                     <FormGroup>
                //                         <div className="custom-control custom-switch">
                //                         <input
                //                             type="checkbox"
                //                             className="custom-control-input form-control"
                //                             onChange={() => setTwitter(!twitter)}
                //                             id="facebook"
                //                         />
                //                         <label className="custom-control-label" htmlFor="twitter"></label>
                //                         </div>
                //                     </FormGroup>
                //                 </Col>
                //             </Row> */}
                    
                //             <Row className="mt-4">
                //                 <Col xl="12">
                //                     <Button color="primary" size="md" onClick={handleSubmit(onFormSubmit)}>
                //                         Publish
                //                     </Button>
                //                 </Col>
                //             </Row>
                //         </PreviewCard>
                //         <PreviewCard>
                //             <OverlineTitle tag="span" className="preview-title-lg">
                //                 Cover Image{" "}
                //             </OverlineTitle>
                //             <Row size="12">
                //                 <Col>
                //                     <img src={imageUrl ? imageUrl : "https://react.dashlite.net/demo1/static/media/b.ab88cd7174e0ef667479.jpg"} alt="preview" />
                //                 </Col>
                //             </Row>
                //             <Row size="12">
                //                 <Col size="6">
                //                     <div className="form-control-wrap mt-3">
                //                         <label className="form-label">Upload Image</label>
                //                         <div className="input-group">
                //                             <div className="custom-file">
                //                             <input
                //                                 type="file"
                //                                 className="custom-file-input"
                //                                 id="inputGroupFile04"
                //                                 onChange={handleImageInput}
                //                             />
                //                             <label className="custom-file-label" htmlFor="inputGroupFile04">
                //                             {selected === "" ? "Choose files" : selected}
                //                             </label>
                //                             </div>
                //                         </div>
                //                     </div>
                //                 </Col>
                //             </Row>
                //             <Row className="mt-4">
                //                 <Col xl="12">
                //                     <Button color="primary" size="md" onClick={uploadImage}>
                //                         Upload
                //                     </Button>
                //                 </Col>
                //             </Row>
                //         </PreviewCard>
                //     </Block>
                // </Col>
//             </Row>
//         </Block>
//         </Content>
//     </React.Fragment>
//   )
// }

// export default UpdatePost