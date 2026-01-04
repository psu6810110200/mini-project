// src/pages/ProfilePage.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const navigate = useNavigate();
  
  // URL ของ Backend สำหรับโหลดรูป (ปรับตาม Port ของคุณ ปกติ NestJS คือ 3000)
  const BACKEND_URL = 'http://localhost:3000'; 

  if (!user) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading Profile...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000', // พื้นหลังดำสนิท
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '60px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      
      {/* --- Card Container (Dossier Style) --- */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.8)'
      }}>
        
        {/* Header Strip */}
        <div style={{
          backgroundColor: '#ffc107',
          color: '#000',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
            AGENT PROFILE
          </h2>
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', border: '2px solid #000', padding: '2px 8px', borderRadius: '4px' }}>
            ID: {user.id.substring(0, 8).toUpperCase()}
          </span>
        </div>

        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* --- Top Section: Avatar & Basic Info --- */}
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Avatar Circle */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#333',
              border: '4px solid #ffc107',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#ffc107',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>

            {/* Info Text */}
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#fff', fontSize: '2rem', margin: '0 0 10px 0' }}>{user.username}</h3>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {/* Role Badge */}
                <span style={{
                  backgroundColor: user.role === 'admin' ? '#dc3545' : '#444',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {user.role}
                </span>

                {/* Verification Badge */}
                {user.is_verified ? (
                   <span style={{ backgroundColor: 'rgba(40, 167, 69, 0.2)', color: '#28a745', border: '1px solid #28a745', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                     ✓ Verified Status
                   </span>
                ) : (
                   <span style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', border: '1px solid #ffc107', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                     ⏳ Pending Verification
                   </span>
                )}
              </div>
            </div>
          </div>

          <hr style={{ borderColor: '#333', margin: '0' }} />

          {/* --- Details Grid --- */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            
            <div style={detailBoxStyle}>
              <label style={labelStyle}>USERNAME / CODENAME</label>
              <div style={valueStyle}>{user.username}</div>
            </div>

            <div style={detailBoxStyle}>
              <label style={labelStyle}>LICENSE NUMBER</label>
              <div style={valueStyle}>
                {user.license_number ? user.license_number : <span style={{color:'#666'}}>- Not registered -</span>}
              </div>
            </div>

          </div>

          {/* --- License Image Section --- */}
          {user.license_image && (
            <div style={{ marginTop: '10px' }}>
              <label style={{ ...labelStyle, marginBottom: '10px', display: 'block' }}>LICENSE DOCUMENT</label>
              <div style={{ 
                border: '1px dashed #444', 
                padding: '10px', 
                borderRadius: '8px', 
                backgroundColor: '#000',
                textAlign: 'center'
              }}>
                <img 
                  src={`${BACKEND_URL}/uploads/${user.license_image}`} 
                  alt="License" 
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                  }}
                />
              </div>
            </div>
          )}

          {/* --- Action Buttons --- */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
             <button 
               onClick={() => navigate('/')}
               style={{
                 flex: 1,
                 padding: '12px',
                 backgroundColor: '#333',
                 color: '#fff',
                 border: 'none',
                 borderRadius: '5px',
                 cursor: 'pointer',
                 fontWeight: 'bold',
                 transition: '0.2s'
               }}
             >
               BACK TO HOME
             </button>
             
             {/* ปุ่มนี้ทำไว้เผื่ออนาคต */}
             {/* <button style={{ ...btnStyle, backgroundColor: '#ffc107', color: '#000' }}>EDIT PROFILE</button> */}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Styles Variables ---
const detailBoxStyle: React.CSSProperties = {
  backgroundColor: '#222',
  padding: '15px',
  borderRadius: '6px',
  border: '1px solid #333'
};

const labelStyle: React.CSSProperties = {
  color: '#888',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  letterSpacing: '1px',
  marginBottom: '5px',
  display: 'block'
};

const valueStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: '1.1rem',
  fontWeight: '500'
};

export default ProfilePage;