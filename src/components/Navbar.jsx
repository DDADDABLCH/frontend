import React, { useEffect, useState } from 'react';
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import defaultProfile from '../assets/cat.jpg';
import SERVER_URL from '../hooks/SeverUrl';
import { IoSnow } from "react-icons/io5";

// Google Font import
const fontStyle = document.createElement('style');
fontStyle.textContent = `@import url('https://fonts.googleapis.com/css2?family=Fauna+One&display=swap');`;
document.head.appendChild(fontStyle);

export default function Navbar() {
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoggedIn(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${SERVER_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRole(data.role);
                    setIsLoggedIn(true);
                } else {
                    // 토큰 만료 또는 인증 실패
                    setRole(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('사용자 정보 요청 실패:', error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
        scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return null; // 로딩 중에는 아무것도 렌더링하지 않음
    }

    const getNavLinkClass = ({ isActive }) => (
        isActive ? 'navbar-link active' : 'navbar-link'
    );

    const renderMenu = () => {
        if (role === 'ROLE_ORGANIZATION') return (
            <div className='org-navbar'
                style={{
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70px',
                    width: '100%'
                }}
            >
                <a href="/organization/home" className="navbar-logo"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: '#0071ce',
                        textDecoration: 'none',
                        fontFamily: '"Fauna One", serif',
                        letterSpacing: '-0.01em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.1rem'
                    }}
                >
                    <IoSnow />
                    SOOKCHAIN
                </a>
            </div>
        );

        return (
            <>
                <div className="navbar-left">
                    <a href="/" className="navbar-logo"
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            color: '#0071ce',
                            textDecoration: 'none',
                            fontFamily: '"Fauna One", serif',
                            letterSpacing: '-0.03em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.1rem'
                        }}
                    >
                        <IoSnow />
                        SOOKCHAIN
                    </a>
                </div>
                <div className="navbar-center">
                    <ul className="navbar-menu">
                        <li><NavLink to="/" className={getNavLinkClass}>홈</NavLink></li>
                        <li><NavLink to="/donate" className={getNavLinkClass}>기부하기</NavLink></li>
                        <li><NavLink to="/reviews" className={getNavLinkClass}>모금후기</NavLink></li>
                        <li><NavLink to="/community" className={getNavLinkClass}>커뮤니티</NavLink></li>
                    </ul>
                </div>
                <div className="navbar-right">
                    {isLoggedIn ? (
                        <NavLink to="/mypage" className="navbar-login">
                            마이페이지
                        </NavLink>
                    ) : (
                        <a href="/login" className="navbar-login">로그인</a>
                    )}
                    <button className="navbar-search-icon" aria-label="검색" onClick={() => navigate('/search')}>
                        <IoSearchSharp />
                    </button>
                </div>
            </>
        );
    };

    return (
        <nav className="navbar">
            {renderMenu()}
        </nav>
    );
}
