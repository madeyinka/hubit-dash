import React, {useState, useEffect} from "react";
import Content from "./../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { FormGroup, Label, Spinner, Row, Col } from "reactstrap";
import {
    Button,
    Block,
    BlockBetween,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    PreviewCard
  } from "../../../components/Component";
  import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const SocialSettings = () => {

    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState()
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
      let isMounted = true
      const controller = new AbortController()

      const fSetting = async () => {
        const response = await axiosPrivate.get('/settings/', {
          signal: controller.signal
        })
        isMounted && setSettings(response.data.data)
      }
      fSetting()

      return () => {
        isMounted = false
        controller.abort()
      }
    }, [])

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const submitForm = async (e) => {
      e.preventDefault()
      setLoading(true)
      try {
        const response = await axiosPrivate.post('/settings/configuration', formData)
        if (response && response.data) {
          setLoading(false)
          setSettings(response.data.data)
        }
      } catch (e) {
          setLoading(false)
      }
    }

  return (
    <React.Fragment>
      <Head title="Socials" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Social Integration</BlockTitle>
              <BlockDes className="text-soft">
                <p>Integrate all social media platforms</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <Button 
                color="info" 
                className="d-none d-sm-inline-flex"
                onClick = {submitForm}
                >
                {loading ? <><Spinner size="sm" /> <span> Saving... </span></> : <span>Save Changes</span>}
              </Button>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Facebook</BlockTitle>
              
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <p>
              Enter you facebook app id and app secret. click <a href="https://developers.facebook.com/" target="_blank">here</a> to create new app
            </p>
            {/* <OverlineTitle tag="span" className="preview-title-lg">
               {" "}
              Facebook{" "}
            </OverlineTitle> */}
            <Row className="gy-4">
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="facebook_page_url" className="form-label">
                    Facbook Page URL
                  </Label>
                  <div className="form-control-wrap">
                    <input 
                        className="form-control" 
                        type="text" 
                        id="facebook_page_url" 
                        name="fb_page_url"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={settings?.config?.fb_page_url}
                        placeholder="Ex. https://www.facebook.com/pagename" />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="facebook_page_id" className="form-label">
                    Facbook Page ID
                  </Label>
                  <div className="form-control-wrap">
                    <input 
                        className="form-control" 
                        type="text" 
                        id="facebook_page_id" 
                        name="fb_page_id"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={settings?.config?.fb_page_id}
                        placeholder="Ex. 100170802521070" />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="facebook_app_id" className="form-label">
                    Facbook App ID
                  </Label>
                  <div className="form-control-wrap">
                    <input 
                        className="form-control" 
                        type="text" 
                        id="facebook_app_id" 
                        name="fb_app_id"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={settings?.config?.fb_app_id}
                        placeholder="Ex. 967748097491075" 
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="facebook_app_secret" className="form-label">
                    Facbook App Secret
                  </Label>
                  <div className="form-control-wrap">
                    <input 
                        className="form-control" 
                        type="text" 
                        id="facebook_app_secret" 
                        name="fb_app_secret"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={settings?.config?.fb_app_secret}
                        placeholder="Ex. 0f8f65624c097c3bccbd7649db09a961" 
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            
          </PreviewCard>
        </Block>

        {/* <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Instagram</BlockTitle>
              <p>
                Enter you facebook app id and app secret. click <a href="https://www.facebook.com" target="_blank">here</a>
              </p>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <OverlineTitle tag="span" className="preview-title-lg">
               {" "}
              Default Preview{" "}
            </OverlineTitle> 
            <Row className="gy-4">
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="default-0" className="form-label">
                    Facbook Page URL
                  </Label>
                  <div className="form-control-wrap">
                    <input className="form-control" type="text" id="default-0" placeholder="Input placeholder" />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="default-0" className="form-label">
                    Facbook App ID
                  </Label>
                  <div className="form-control-wrap">
                    <input className="form-control" type="text" id="default-0" placeholder="Input placeholder" />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="default-0" className="form-label">
                    Facbook App Secret
                  </Label>
                  <div className="form-control-wrap">
                    <input className="form-control" type="text" id="default-0" placeholder="Input placeholder" />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            
          </PreviewCard>
        </Block> */}
      </Content>
    </React.Fragment>
  );
};

export default SocialSettings;