import React, { useState, useEffect } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";


const User = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const axiosPrivate = useAxiosPrivate()
  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fuser = async () => {
      try {
        const response = await axiosPrivate.get('/user', {
          signal: controller.signal
        })
        isMounted && setUser(response.data.data)
      } catch (e) {
        // console.log(e.message)
        navigate('/auth-login', { state: { from: location }, replace: true })
      }  
    }
    fuser()

    return () => {
      isMounted = false
      controller.abort()
    }
  },[])

  const handleSignout = () => {
    localStorage.removeItem("accessToken");
  };

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar image={user?.image} className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="user-status">Administrator</div>
            <div className="user-name dropdown-indicator">{user.local?.display_name}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <img src={user?.image} alt="" />
            </div>
            <div className="user-info">
              <span className="lead-text">{user.local?.display_name}</span>
              <span className="sub-text">{user.local?.email}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem link="/dashboard/user/basic-information" icon="user-alt" onClick={toggle}>
              View Profile
            </LinkItem>
            <LinkItem link="/user-profile-setting" icon="setting-alt" onClick={toggle}>
              Account Setting
            </LinkItem>
            <LinkItem link="/dashboard/user/profile-activity" icon="activity-alt" onClick={toggle}>
              Preferences
            </LinkItem>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
