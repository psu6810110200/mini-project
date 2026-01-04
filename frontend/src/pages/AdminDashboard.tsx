// src/pages/AdminDashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import './AdminDashboard.css'; 
import api from '../api/axios'; 
import { createWeapon, updateWeapon, deleteWeapon } from '../api/weaponApi'; // ลบ getWeapons ออก
import { updateOrderStatus } from '../api/orderApi'; // ลบ getAllOrders ออก
import { useAdmin } from '../context/AdminContext'; // ✅ เรียกใช้ Context
import type { WeaponPayload } from '../types';
import { OrderStatus } from '../types';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  // ✅ 1. ดึงข้อมูลและฟังก์ชันจาก Context
  const { 
    weapons, orders, users, loading, 
    fetchWeapons, fetchOrders, fetchUsers 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'weapons' | 'orders' | 'users'>('weapons');

  // --- Search & Filter States ---
  const [weaponSearch, setWeaponSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // --- Form State ---
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WeaponPayload>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'light',
    required_license_level: 1,
    image: '', 
  });

  // ✅ 2. useEffect ฉลาดขึ้น: โหลดเฉพาะตอนที่ "ยังไม่มีข้อมูล" เท่านั้น
  useEffect(() => {
    if (activeTab === 'weapons' && weapons.length === 0) fetchWeapons();
    else if (activeTab === 'orders' && orders.length === 0) fetchOrders();
    else if (activeTab === 'users' && users.length === 0) fetchUsers();
  }, [activeTab]);

  // --- 3. Dashboard Summary Stats ---
  const stats = useMemo(() => {
    return {
      totalRevenue: orders
        .filter(o => o.status === OrderStatus.APPROVED)
        .reduce((sum, o) => sum + Number(o.total_price), 0),
      pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
      pendingUsers: users.filter(u => !u.is_verified && u.role !== 'admin').length,
      lowStockItems: weapons.filter(w => w.stock < 5).length
    };
  }, [orders, users, weapons]);

  // --- Filtered Data Logic ---
  const filteredWeapons = weapons.filter(w => 
    w.name.toLowerCase().includes(weaponSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    (o.user?.username || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.id.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => {
    if (userFilter === 'verified') return u.is_verified;
    if (userFilter === 'pending') return !u.is_verified;
    return true; // all
  });

  // --- Handlers ---
  const formatDateOnly = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['price', 'stock', 'required_license_level'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await updateWeapon(currentId, formData);
        toast.success('แก้ไขข้อมูลสำเร็จ');
      } else {
        await createWeapon(formData);
        toast.success('เพิ่มอาวุธสำเร็จ');
      }
      resetForm();
      fetchWeapons(); // ✅ เรียก fetch ผ่าน Context เพื่ออัปเดตข้อมูลกลาง
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันที่จะลบอาวุธชิ้นนี้?')) return;
    try {
      await deleteWeapon(id);
      toast.success('ลบข้อมูลสำเร็จ');
      fetchWeapons(); // ✅ อัปเดตข้อมูลกลาง
    } catch (error) {
      toast.error('ลบข้อมูลไม่สำเร็จ');
    }
  };

  const startEdit = (weapon: any) => {
    setIsEditing(true);
    setCurrentId(weapon.id);
    setFormData({
      name: weapon.name,
      description: weapon.description,
      price: Number(weapon.price),
      stock: weapon.stock,
      category: weapon.category,
      required_license_level: weapon.required_license_level,
      image: weapon.image || '', 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '', description: '', price: 0, stock: 0,
      category: 'light', required_license_level: 1, image: '', 
    });
  };

  const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    if (!confirm(`ยืนยันเปลี่ยนสถานะเป็น ${newStatus}?`)) return;
    try {
      await updateOrderStatus(id, newStatus);
      toast.success(`อัปเดตสถานะเป็น ${newStatus} แล้ว`);
      fetchOrders(); // ✅ อัปเดตข้อมูลกลาง
    } catch (error) {
      toast.error('อัปเดตสถานะล้มเหลว');
    }
  };

  const handleVerifyUser = async (userId: string) => {
    if (!confirm('ยืนยันอนุมัติผู้ใช้งานรายนี้?')) return;
    try {
      await api.patch(`/users/${userId}`, { is_verified: true });
      toast.success('อนุมัติผู้ใช้งานเรียบร้อย');
      fetchUsers(); // ✅ อัปเดตข้อมูลกลาง
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!confirm('ยืนยันที่จะปฏิเสธและลบผู้ใช้งานรายนี้?')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('ปฏิเสธผู้ใช้งานเรียบร้อย');
      fetchUsers(); // ✅ อัปเดตข้อมูลกลาง
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการปฏิเสธ');
    }
  };

  return (
    <div className="admin-container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 className="admin-header">🛡️ Admin Dashboard</h1>
        {/* ปุ่ม Refresh ด้วยมือ เผื่ออยากดึงข้อมูลใหม่จริงๆ */}
        <button 
           onClick={() => { fetchWeapons(); fetchOrders(); fetchUsers(); toast.info('Refreshed Data'); }}
           style={{ background: '#333', color: 'white', border: '1px solid #555', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
        >
          🔄 Refresh All
        </button>
      </div>

      {/* DASHBOARD SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* ... (Code ส่วน Cards เหมือนเดิม ไม่ต้องแก้) ... */}
        {/* ตัวอย่าง Card 1 อัน */}
        <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderLeft: '5px solid #28a745', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>💰 ยอดขายรวม (Approved)</h3>
          <p style={{ margin: '10px 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
            ${stats.totalRevenue.toLocaleString()}
          </p>
        </div>
        {/* ใส่ Card อื่นๆ ที่เหลือตามโค้ดเดิม... */}
         <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderLeft: '5px solid #ffc107', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>📦 รอตรวจสอบ (Orders)</h3>
          <p style={{ margin: '10px 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.pendingOrders} <span style={{ fontSize: '1rem' }}>รายการ</span>
          </p>
        </div>
        <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderLeft: '5px solid #17a2b8', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>👤 รอยืนยันตัวตน (Users)</h3>
          <p style={{ margin: '10px 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#17a2b8' }}>
            {stats.pendingUsers} <span style={{ fontSize: '1rem' }}>คน</span>
          </p>
        </div>
        <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderLeft: '5px solid #dc3545', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>⚠️ สินค้าใกล้หมด (&lt;5)</h3>
          <p style={{ margin: '10px 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#dc3545' }}>
            {stats.lowStockItems} <span style={{ fontSize: '1rem' }}>รายการ</span>
          </p>
        </div>
      </div>

      {/* Tab Menu */}
      <div className="tab-menu">
        <button className={`tab-btn ${activeTab === 'weapons' ? 'active' : ''}`} onClick={() => setActiveTab('weapons')}>
          จัดการคลังอาวุธ 🔫
        </button>
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          ตรวจสอบคำสั่งซื้อ 📋
        </button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          สมาชิก / ยืนยันตัวตน 👤
        </button>
      </div>

      {/* ==================== WEAPONS TAB ==================== */}
      {activeTab === 'weapons' && (
        <>
          <div className="dark-card">
            <h3>{isEditing ? '🔧 แก้ไขอาวุธ' : '➕ เพิ่มอาวุธใหม่'}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
               {/* ... (Inputs ในฟอร์มเหมือนเดิมทุกอย่าง ก๊อปของเดิมมาใส่ได้เลย) ... */}
               <div className="form-group full-width"><label className="form-label">ชื่ออาวุธ:</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="Ex. M4A1 Carbine" /></div>
               <div className="form-group full-width"><label className="form-label">URL รูปภาพ:</label><input type="text" name="image" value={formData.image || ''} onChange={handleChange} placeholder="https://..." className="form-input" /></div>
               <div className="form-group full-width"><label className="form-label">รายละเอียด:</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="form-textarea" placeholder="รายละเอียด..." /></div>
               <div className="form-group"><label className="form-label">ราคา ($):</label><input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-input" /></div>
               <div className="form-group"><label className="form-label">Stock:</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="form-input" /></div>
               <div className="form-group"><label className="form-label">หมวดหมู่:</label><select name="category" value={formData.category} onChange={handleChange} className="form-select"><option value="light">Light</option><option value="heavy">Heavy</option><option value="explosive">Explosive</option></select></div>
               <div className="form-group"><label className="form-label">License Level:</label><input type="number" name="required_license_level" value={formData.required_license_level} onChange={handleChange} required className="form-input" /></div>
              
              <div className="form-group full-width" style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-submit" style={{ marginRight: '10px' }}>
                  {isEditing ? 'บันทึกการแก้ไข' : 'ยืนยันเพิ่มอาวุธ'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn-cancel">ยกเลิก</button>
                )}
              </div>
            </form>
          </div>

          <div className="dark-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>📦 รายการอาวุธทั้งหมด ({filteredWeapons.length})</h3>
              <input type="text" placeholder="🔍 ค้นหาอาวุธ..." value={weaponSearch} onChange={(e) => setWeaponSearch(e.target.value)} className="form-input" style={{ width: '250px', padding: '8px' }} />
            </div>

            <div className="table-container">
              {loading.weapons ? <p style={{color: '#aaa'}}>Loading...</p> : (
                <table className="cyber-table">
                  <thead>
                    <tr>
                      <th style={{width: '60px'}}>รูป</th><th>ชื่อ</th><th>หมวดหมู่</th><th>ราคา</th><th>Stock</th><th>License</th><th style={{ textAlign: 'center' }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWeapons.map((w) => (
                      <tr key={w.id}>
                        <td style={{ textAlign: 'center' }}>{w.image ? <img src={w.image} alt={w.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /> : '-'}</td>
                        <td style={{ fontWeight: 'bold' }}>{w.name}</td>
                        <td><span style={{ textTransform: 'capitalize', color: '#ccc' }}>{w.category}</span></td>
                        <td style={{ color: '#28a745' }}>${Number(w.price).toLocaleString()}</td>
                        <td style={{ color: w.stock < 5 ? '#dc3545' : 'inherit', fontWeight: w.stock < 5 ? 'bold' : 'normal' }}>{w.stock}</td>
                        <td style={{textAlign: 'center'}}>{w.required_license_level}</td>
                        <td style={{textAlign: 'center'}}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button onClick={() => startEdit(w)} className="btn-action" style={{ backgroundColor: '#ffc107', color: 'black' }}>✏️</button>
                            <button onClick={() => handleDelete(w.id)} className="btn-action" style={{ backgroundColor: '#dc3545', color: 'white' }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* ==================== ORDERS TAB ==================== */}
      {activeTab === 'orders' && (
        <div className="dark-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>🛒 รายการคำสั่งซื้อ ({filteredOrders.length})</h3>
            <input type="text" placeholder="🔍 ค้นหา Username / Order ID..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="form-input" style={{ width: '300px', padding: '8px' }} />
          </div>

          <div className="table-container">
            {loading.orders ? <p style={{color: '#aaa'}}>Loading orders...</p> : (
              <table className="cyber-table">
                {/* ... (Table Headers เหมือนเดิม) ... */}
                <thead><tr><th>Order ID</th><th>วันที่</th><th>ลูกค้า</th><th>License</th><th>รับสินค้า</th><th>รายการ</th><th>ยอดรวม</th><th>สถานะ</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      {/* ... (Table Row Content เหมือนเดิม) ... */}
                      <td><small style={{color:'#777'}}>{order.id.substring(0, 8)}...</small></td>
                      <td>{formatDateOnly(order.created_at)}</td>
                      <td style={{ fontWeight: 'bold', color: '#fff' }}>{order.user?.username || 'Unknown'}</td>
                      <td style={{ color: order.user?.license_number ? '#00d2ff' : '#555', textAlign: 'center' }}>{order.user?.license_number || '-'}</td>
                      <td style={{ color: '#ffc107' }}>{formatDateOnly(order.received_date)}</td>
                      <td>
                        <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '0.85rem', color: '#ccc' }}>
                          {order.order_items?.map((item) => <li key={item.id}>{item.weapon?.name} <span style={{color: '#888'}}>x{item.quantity}</span></li>)}
                        </ul>
                      </td>
                      <td style={{ color: '#28a745' }}>${Number(order.total_price).toLocaleString()}</td>
                      <td>
                         <span className="status-badge" style={{
                          backgroundColor: order.status === OrderStatus.APPROVED ? 'rgba(40, 167, 69, 0.2)' : order.status === OrderStatus.REJECTED ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                          color: order.status === OrderStatus.APPROVED ? '#28a745' : order.status === OrderStatus.REJECTED ? '#dc3545' : '#ffc107'
                        }}>{order.status.toUpperCase()}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {order.status === OrderStatus.PENDING && (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                            <button onClick={() => handleStatusUpdate(order.id, OrderStatus.APPROVED)} className="btn-action" style={{ backgroundColor: '#28a745' }}>✓</button>
                            <button onClick={() => handleStatusUpdate(order.id, OrderStatus.REJECTED)} className="btn-action" style={{ backgroundColor: '#dc3545' }}>✕</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ==================== USERS TAB ==================== */}
      {activeTab === 'users' && (
        <div className="dark-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>👤 จัดการสมาชิก ({filteredUsers.length})</h3>
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value as any)} className="form-select" style={{ width: '200px', padding: '8px' }}>
              <option value="all">ทั้งหมด (All Users)</option>
              <option value="pending">⏳ รออนุมัติ (Pending)</option>
              <option value="verified">✓ ยืนยันแล้ว (Verified)</option>
            </select>
          </div>

          <div className="table-container">
            {loading.users ? <p style={{color: '#aaa'}}>Loading users...</p> : (
              <table className="cyber-table">
                <thead><tr><th>Username</th><th>Role</th><th>License No.</th><th>เอกสารยืนยัน</th><th>สถานะ</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 'bold', color: '#fff' }}>{user.username}</td>
                      <td>{user.role}</td>
                      <td>{user.license_number || <span style={{color:'#555'}}>-</span>}</td>
                      <td>
                        {user.license_image ? (
                          <a href={`http://localhost:3000/uploads/${user.license_image}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00d2ff', textDecoration: 'underline', fontSize: '0.9rem' }}>📄 ดูรูปภาพ</a>
                        ) : (<span style={{ color: '#555', fontStyle: 'italic' }}>ไม่มีเอกสาร</span>)}
                      </td>
                      <td>
                        {user.is_verified ? (<span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Verified</span>) : (<span style={{ color: '#ffc107', fontWeight: 'bold' }}>⏳ Pending</span>)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {!user.is_verified && user.role !== 'admin' && (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                            <button onClick={() => handleVerifyUser(user.id)} className="btn-action" style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 12px', fontSize: '0.8rem', width: 'auto' }}>อนุมัติ</button>
                            <button onClick={() => handleRejectUser(user.id)} className="btn-action" style={{ backgroundColor: '#dc3545', color: 'white', padding: '5px 12px', fontSize: '0.8rem', width: 'auto' }}>ปฏิเสธ</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;