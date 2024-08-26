import React, {memo} from 'react';
import "./styles.scss";
import { Stack, Typography } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ACTION_SHOWAUTHENTICATIONPOPUP } from "../../../Store/action";
import { useDispatch, useSelector } from 'react-redux';

const Index = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isloggeduser, showAuthencationPopup } = useSelector(state => {
        return {
            isloggeduser: state?.isloggeduser,
            showAuthencationPopup: state?.showAuthencationPopup
        }
    })
    const location = useLocation();
    const pathName = location?.pathname?.split('/');

    return (

        <Stack className='mobile-header-section-bottom'>
            <Stack className='menu-list-section'>
                <Stack className='icon-img-text'>
                    <Link className={`list-text mobile-home ${pathName?.[1] === "" ? 'active' : ''}`} to='/'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="Group_3599" data-name="Group 3599" transform="translate(-8573 377)">
                                <rect id="Rectangle_2429" data-name="Rectangle 2429" width="24" height="24" transform="translate(8573 -377)" fill="none" />
                                <path id="home" d="M4.485,12.564V10.5a.961.961,0,0,1,.959-.956H7.389a.961.961,0,0,1,.966.956h0V12.57a.825.825,0,0,0,.81.821h1.3a2.328,2.328,0,0,0,2.34-2.316h0V5.2a1.643,1.643,0,0,0-.648-1.283L7.719.379,6.3-.546,5.062.379.648,3.92A1.631,1.631,0,0,0,0,5.2v5.871a2.328,2.328,0,0,0,2.34,2.316h1.3a.832.832,0,0,0,.836-.828h0" transform="translate(8578.306 -371.592)" fill="none" stroke="#a8b0bb" strokeLinecap="round" strokeWidth="1" />
                            </g>
                        </svg>
                        <Typography className='list-text'>Home</Typography>
                    </Link>
                </Stack>
                <Stack className='icon-img-text myaccount-icons'>
                    <Typography
                        className={`list-text ${pathName?.[1] === "account" && pathName?.[2] !== "mywishlist" ? 'active' : ''}`}
                        onClick={() => {
                            if (isloggeduser) {
                                navigate(`/account/dashboard`)
                            } else {
                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                    loginReg: !showAuthencationPopup?.loginReg,
                                    forgotPas: false,
                                    resetPass: false
                                }))
                            }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="Group_3594" data-name="Group 3594" transform="translate(-2908 -245)">
                                <rect id="Rectangle_2585" data-name="Rectangle 2585" width="24" height="24" transform="translate(2908 245)" fill="none" />
                                <g id="Group_3593" data-name="Group 3593" transform="translate(2914 250)">
                                    <g id="Union_4" data-name="Union 4" transform="translate(-2732 -16072)" fill="#fff">
                                        <path d="M 2743.251708984375 16085.501953125 L 2732.751220703125 16085.501953125 C 2732.613037109375 16085.501953125 2732.50048828125 16085.3896484375 2732.50048828125 16085.2509765625 L 2732.50048828125 16085.0009765625 C 2732.50048828125 16081.96875 2734.96728515625 16079.501953125 2737.99951171875 16079.501953125 C 2741.03173828125 16079.501953125 2743.49853515625 16081.96875 2743.49853515625 16085.0009765625 L 2743.49853515625 16085.2509765625 C 2743.49853515625 16085.38671875 2743.385498046875 16085.501953125 2743.251708984375 16085.501953125 Z M 2737.99951171875 16077.5 C 2736.621337890625 16077.5 2735.5 16076.37890625 2735.5 16075.0009765625 C 2735.5 16073.6220703125 2736.621337890625 16072.5009765625 2737.99951171875 16072.5009765625 C 2739.377685546875 16072.5009765625 2740.4990234375 16073.6220703125 2740.4990234375 16075.0009765625 C 2740.4990234375 16076.37890625 2739.377685546875 16077.5 2737.99951171875 16077.5 Z" stroke="none" />
                                        <path d="M 2742.99853515625 16085.001953125 L 2742.99853515625 16085.0009765625 C 2742.99853515625 16082.244140625 2740.756103515625 16080.001953125 2737.99951171875 16080.001953125 C 2735.242919921875 16080.001953125 2733.00048828125 16082.244140625 2733.00048828125 16085.0009765625 L 2733.00048828125 16085.001953125 L 2742.99853515625 16085.001953125 M 2737.99951171875 16077 C 2739.10205078125 16077 2739.9990234375 16076.103515625 2739.9990234375 16075.0009765625 C 2739.9990234375 16073.8984375 2739.10205078125 16073.0009765625 2737.99951171875 16073.0009765625 C 2736.89697265625 16073.0009765625 2736 16073.8984375 2736 16075.0009765625 C 2736 16076.103515625 2736.89697265625 16077 2737.99951171875 16077 M 2743.251708984375 16086.001953125 L 2732.751220703125 16086.001953125 C 2732.33544921875 16086.001953125 2732.00048828125 16085.6630859375 2732.00048828125 16085.2509765625 L 2732.00048828125 16085.0009765625 C 2732.00048828125 16081.6865234375 2734.68505859375 16079.001953125 2737.99951171875 16079.001953125 C 2741.31396484375 16079.001953125 2743.99853515625 16081.6865234375 2743.99853515625 16085.0009765625 L 2743.99853515625 16085.2509765625 C 2743.99853515625 16085.6630859375 2743.66357421875 16086.001953125 2743.251708984375 16086.001953125 Z M 2737.99951171875 16078 C 2736.34423828125 16078 2735 16076.65625 2735 16075.0009765625 C 2735 16073.341796875 2736.34423828125 16072.0009765625 2737.99951171875 16072.0009765625 C 2739.65869140625 16072.0009765625 2740.9990234375 16073.341796875 2740.9990234375 16075.0009765625 C 2740.9990234375 16076.65625 2739.65869140625 16078 2737.99951171875 16078 Z" stroke="none" fill="#a8b0bb" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <Typography className='list-text'>My Account</Typography>
                    </Typography>
                </Stack>
                <Stack className='icon-img-text'>
                    <Typography
                        className={`list-text ${pathName?.[2] === "mywishlist" ? 'active' : ''}`}
                        onClick={() => {
                            if (isloggeduser) {
                                navigate(`/account/mywishlist`)
                            } else {
                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                    loginReg: !showAuthencationPopup?.loginReg,
                                    forgotPas: false,
                                    resetPass: false
                                }))
                            }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="Group_3590" data-name="Group 3590" transform="translate(-2127 -97)">
                                <rect id="Rectangle_2587" data-name="Rectangle 2587" width="24" height="24" transform="translate(2127 97)" fill="none" />
                                <path id="swaminathan-icons-03" d="M19.475,16.314s-.576-.725-1-1.246a2.843,2.843,0,0,0-4.462,0,4.145,4.145,0,0,0,0,5.243c1.543,1.766,5.485,6.135,5.485,6.135s3.923-4.388,5.466-6.135a4.145,4.145,0,0,0,0-5.243,2.843,2.843,0,0,0-4.462,0C20.051,15.589,19.475,16.314,19.475,16.314Z" transform="translate(2119.426 89.274)" fill="none" stroke="#a8b0bb" strokeLinejoin="round" strokeWidth="1" />
                            </g>
                        </svg>
                        <Typography className='list-text'>My Wishlist</Typography>
                    </Typography>
                </Stack>
                <Stack className='icon-img-text my-cart-section'>

                    <Link className={`list-text ${pathName?.[1] === "mycart" ? 'active' : ''}`} to='/mycart'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="Group_3592" data-name="Group 3592" transform="translate(-2036 -96.693)">
                                <rect id="Rectangle_2585" data-name="Rectangle 2585" width="24" height="24" transform="translate(2036 96.693)" fill="none" />
                                <path id="Union_8" data-name="Union 8" d="M4741.5,16188.258a.514.514,0,0,1-.378-.17.534.534,0,0,1-.122-.391l1.207-10.026a.494.494,0,0,1,.5-.438h2.173v-.691a2.88,2.88,0,0,1,2.9-2.848h1.2a2.873,2.873,0,0,1,2.889,2.848v.691h2.173a.5.5,0,0,1,.5.438l1.2,10.026a.508.508,0,0,1-.5.561Zm.561-1h12.623l-1.081-9.027h-1.73v.775h.378v1h-1.775v-1h.4v-.775h-5v.775h.394v1H4744.5v-1h.382v-.775h-1.73Zm8.812-10.022v-.691a1.872,1.872,0,0,0-1.889-1.849h-1.2a1.881,1.881,0,0,0-1.905,1.849v.691Zm-8.17,8.958v-1h11.343v1Z" transform="translate(-2700.211 -16071.943)" fill="#a8b0bb" />
                            </g>
                        </svg>
                        <Typography className='list-text'>My Cart</Typography>
                    </Link>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default memo(Index);
