import React, { useContext } from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";
import { Link } from "react-router-dom";
import { Context } from "../../main";
function Footer() {
  const { isAuthorized } = useContext(Context)
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved by shashikant singh.</div>
      <div>
        <Link to={'https://github.com/shashikant2702'} target='github'><FaGithub></FaGithub></Link>
        <Link to={'https://leetcode.com/u/shashikant2702/ '} target='leetcode'><SiLeetcode></SiLeetcode></Link>
        <Link to={'https://www.linkedin.com/in/shashikantsingh2705?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BpvoSSQE8T2C6PfI478VEFQ%3D%3D'} target='linkedin'><FaLinkedin></FaLinkedin></Link>
        <Link to={'https://www.instagram.com/imsraghuvanshi/'} target='instagram'><RiInstagramFill></RiInstagramFill></Link>
      </div>

    </footer>
  )
}

export default Footer