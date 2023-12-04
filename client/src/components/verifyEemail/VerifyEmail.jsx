import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { makeRequest } from "../../utils/axios";
import "./VerifyEmail.css"
import  success from "../../assets/success.png"

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(true);
	const [err, SetErr] = useState(null)
	const param = useParams();
	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `/user/${param.id}/verify/${param.token}`;
				const { data } = await makeRequest.get(url);
				console.log(data);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
				SetErr(error.response)
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, []);
	return (
		<>
			{validUrl ? (
				<div className="email-container">
					 <img src={success} alt="houses"  className="success-img"/>
					<h1>Email verified successfully</h1>
					<Link to="/login">
						<button className='button'>Login</button>
					</Link>
				</div>
			) : (
				<div className="v-container">
				<h1>404 Not Found</h1>
				</div>

			)}
		</>
	);
};

export default EmailVerify;