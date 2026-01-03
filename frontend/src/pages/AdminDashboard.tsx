// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import './AdminDashboard.css'; 

import { getWeapons, createWeapon, updateWeapon, deleteWeapon } from '../api/weaponApi';
import { getAllOrders, updateOrderStatus } from '../api/orderApi';
import type { Weapon, WeaponPayload, Order } from '../types';
import { OrderStatus } from '../types';
import { toast } from 'react-toastify';

interface AdminOrder extends Order {
  user?: {
    username: string;
    email?: string;
    license_number?: string;
  };
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'weapons' | 'orders'>('weapons');

  // --- State Weapons ---
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loadingWeapons, setLoadingWeapons] = useState(false);
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

  // --- State Orders ---
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchWeapons = async () => {
    try {
      setLoadingWeapons(true);
      const response = await getWeapons({ page: 1, limit: 100 }); 
      setWeapons(response.data);
    } catch (error) {
      toast.error('ไม่สามารถดึงข้อมูลอาวุธได้');
    } finally {
      setLoadingWeapons(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'weapons') {
      fetchWeapons();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'required_license_level' ? Number(value) : value,
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
      fetchWeapons();
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันที่จะลบอาวุธชิ้นนี้?')) return;
    try {
      await deleteWeapon(id);
      toast.success('ลบข้อมูลสำเร็จ');
      fetchWeapons();
    } catch (error) {
      toast.error('ลบข้อมูลไม่สำเร็จ');
    }
  };

  const startEdit = (weapon: Weapon) => {
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
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'light',
      required_license_level: 1,
      image: '', 
    });
  };

  const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    if (!confirm(`ยืนยันเปลี่ยนสถานะเป็น ${newStatus}?`)) return;
    try {
      await updateOrderStatus(id, newStatus);
      toast.success(`อัปเดตสถานะเป็น ${newStatus} แล้ว`);
      fetchOrders();
    } catch (error) {
      toast.error('อัปเดตสถานะล้มเหลว');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">🛡️ Admin Dashboard</h1>

      {/* Tab Menu */}
      <div className="tab-menu">
        <button 
          className={`tab-btn ${activeTab === 'weapons' ? 'active' : ''}`}
          onClick={() => setActiveTab('weapons')}
        >
          จัดการคลังอาวุธ 🔫
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          ตรวจสอบคำสั่งซื้อ 📋
        </button>
      </div>

      {/* ==================== WEAPONS TAB ==================== */}
      {activeTab === 'weapons' && (
        <>
          <div className="dark-card">
            <h3>{isEditing ? '🔧 แก้ไขอาวุธ' : '➕ เพิ่มอาวุธใหม่'}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              
              <div className="form-group full-width">
                <label className="form-label">ชื่ออาวุธ:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="Ex. M4A1 Carbine" />
              </div>

              <div className="form-group full-width">
                <label className="form-label">URL รูปภาพ:</label>
                <input type="text" name="image" value={formData.image || ''} onChange={handleChange} placeholder="https://..." className="form-input" />
              </div>

              <div className="form-group full-width">
                <label className="form-label">รายละเอียด:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="form-textarea" placeholder="รายละเอียดของอาวุธ..." />
              </div>
              
              <div className="form-group">
                <label className="form-label">ราคา ($):</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Stock:</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="form-input" />
              </div>
              
              <div className="form-group">
                <label className="form-label">หมวดหมู่:</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                  <option value="light">Light</option>
                  <option value="heavy">Heavy</option>
                  <option value="explosive">Explosive</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">License Level:</label>
                <input type="number" name="required_license_level" value={formData.required_license_level} onChange={handleChange} required className="form-input" />
              </div>
              
              <div className="form-group full-width" style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-submit" style={{ marginRight: '10px' }}>
                  {isEditing ? 'บันทึกการแก้ไข' : 'ยืนยันเพิ่มอาวุธ'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn-cancel">
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="dark-card">
            <h3>📦 รายการอาวุธทั้งหมด ({weapons.length})</h3>
            <div className="table-container">
              {loadingWeapons ? <p style={{color: '#aaa'}}>Loading data...</p> : (
                <table className="cyber-table">
                  <thead>
                    <tr>
                      <th style={{width: '80px'}}>รูป</th>
                      <th>ชื่อ</th>
                      <th>ราคา</th>
                      <th>Stock</th>
                      <th>License</th>
                      <th style={{ textAlign: 'center' }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weapons.map((w) => (
                      <tr key={w.id}>
                        <td style={{ textAlign: 'center' }}>
                          {w.image ? (
                            <img src={w.image} alt={w.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} />
                          ) : (
                            <span style={{color: '#555'}}>-</span>
                          )}
                        </td>
                        <td style={{ fontWeight: 'bold' }}>{w.name}</td>
                        <td style={{ color: '#28a745' }}>${Number(w.price).toLocaleString()}</td>
                        <td style={{ color: w.stock < 5 ? '#dc3545' : 'inherit' }}>{w.stock}</td>
                        <td style={{textAlign: 'center'}}>{w.required_license_level}</td>
                        <td style={{textAlign: 'center'}}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <button 
                              onClick={() => startEdit(w)} 
                              className="btn-action"
                              style={{ backgroundColor: '#ffc107', color: 'black' }}
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDelete(w.id)} 
                              className="btn-action"
                              style={{ backgroundColor: '#dc3545', color: 'white' }}
                            >
                              🗑️
                            </button>
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
          <h3>🛒 รายการคำสั่งซื้อ ({orders.length})</h3>
          <div className="table-container">
            {loadingOrders ? <p style={{color: '#aaa'}}>Loading orders...</p> : (
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>ลูกค้า</th>
                    <th>License</th>
                    <th>รายการสินค้า</th>
                    <th>ยอดรวม</th>
                    <th>สถานะ</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td><small style={{color:'#777'}}>{order.id.substring(0, 8)}...</small></td>
                      <td>{order.user?.username || 'Unknown User'}</td>
                      <td style={{ color: order.user?.license_number ? '#007bff' : '#555', textAlign: 'center', fontWeight: 'bold' }}>
                        {order.user?.license_number || 'N/A'}
                      </td>
                      <td>
                        <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: '#ccc' }}>
                          {order.order_items?.map((item) => (
                            <li key={item.id}>
                              {item.weapon?.name} <span style={{color: '#888'}}>x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ color: '#28a745', fontWeight: 'bold' }}>${Number(order.total_price).toLocaleString()}</td>
                      <td>
                        <span className="status-badge" style={{
                          backgroundColor: 
                            order.status === OrderStatus.APPROVED ? 'rgba(40, 167, 69, 0.2)' : 
                            order.status === OrderStatus.REJECTED ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                          color: 
                            order.status === OrderStatus.APPROVED ? '#28a745' : 
                            order.status === OrderStatus.REJECTED ? '#dc3545' : '#ffc107'
                        }}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {order.status === OrderStatus.PENDING ? (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              onClick={() => handleStatusUpdate(order.id, OrderStatus.APPROVED)}
                              className="btn-action"
                              style={{ backgroundColor: '#28a745', fontSize: '0.8rem' }}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(order.id, OrderStatus.REJECTED)}
                              className="btn-action"
                              style={{ backgroundColor: '#dc3545', fontSize: '0.8rem' }}
                              title="Reject"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#555', fontStyle: 'italic', fontSize: '0.8rem' }}>-</span>
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