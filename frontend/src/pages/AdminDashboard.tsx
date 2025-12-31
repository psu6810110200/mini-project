// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
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
    
      // 2. ดึง .data ออกมาจาก response ก่อนนำไปใส่ State
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

  // --- Handlers: Weapon ---
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

  // --- Handlers: Order ---
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
    <div className="container" style={{ marginTop: '20px', color: '#000' }}> 
      <h1 style={{ color: 'white' }}>Admin Dashboard</h1>

      {/* Tab Menu */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('weapons')}
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer',
            backgroundColor: activeTab === 'weapons' ? '#ffc107' : '#ddd',
            border: 'none', borderRadius: '5px', fontWeight: 'bold'
          }}
        >
          จัดการคลังอาวุธ
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer',
            backgroundColor: activeTab === 'orders' ? '#ffc107' : '#ddd',
            border: 'none', borderRadius: '5px', fontWeight: 'bold'
          }}
        >
          ตรวจสอบคำสั่งซื้อ
        </button>
      </div>

      {/* ==================== WEAPONS TAB ==================== */}
      {activeTab === 'weapons' && (
        <>
          <div className="card" style={{ padding: '20px', marginBottom: '30px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
            <h3>{isEditing ? 'แก้ไขอาวุธ' : 'เพิ่มอาวุธใหม่'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label>ชื่ออาวุธ:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label>URL รูปภาพ:</label>
                <input type="text" name="image" value={formData.image || ''} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '8px' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label>รายละเอียด:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} style={{ width: '100%', padding: '8px' }} />
              </div>
              
              <div>
                <label>ราคา ($):</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Stock:</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
              
              <div>
                <label>หมวดหมู่:</label>
                <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="light">Light</option>
                  <option value="heavy">Heavy</option>
                  <option value="explosive">Explosive</option>
                </select>
              </div>
              <div>
                <label>License Level:</label>
                <input type="number" name="required_license_level" value={formData.required_license_level} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
              
              <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
                  {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มอาวุธ'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} style={{ backgroundColor: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card" style={{ marginTop: '20px', overflowX: 'auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h3>รายการอาวุธทั้งหมด ({weapons.length})</h3>
            {loadingWeapons ? <p>Loading...</p> : (
              <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#eee' }}>
                    <th>รูป</th>
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
                        {w.image ? <img src={w.image} alt="p" style={{ width: '50px', height: '50px', objectFit: 'cover' }} /> : '-'}
                      </td>
                      <td>{w.name}</td>
                      <td>${Number(w.price).toLocaleString()}</td>
                      <td>{w.stock}</td>
                      <td style={{textAlign: 'center'}}>{w.required_license_level}</td>
                      <td style={{textAlign: 'center'}}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <button 
                            onClick={() => startEdit(w)} 
                            style={{ 
                              cursor: 'pointer',
                              backgroundColor: '#ffc107', // สีเหลือง
                              color: 'black',
                              border: 'none',
                              borderRadius: '5px',
                              padding: '5px 10px',
                              fontWeight: 'bold'
                            }}
                          >
                            ✏️ แก้ไข
                          </button>
                          <button 
                            onClick={() => handleDelete(w.id)} 
                            style={{ 
                              cursor: 'pointer',
                              backgroundColor: '#dc3545', // สีแดง
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              padding: '5px 10px',
                              fontWeight: 'bold'
                            }}
                          >
                            🗑️ ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ==================== ORDERS TAB ==================== */}
      {activeTab === 'orders' && (
        <div className="card" style={{ marginTop: '20px', overflowX: 'auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>รายการคำสั่งซื้อ ({orders.length})</h3>
          {loadingOrders ? <p>Loading...</p> : (
            <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#eee' }}>
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
                    <td><small>{order.id.substring(0, 8)}...</small></td>
                    <td>{order.user?.username || 'Unknown User'}</td>
                    <td style={{ color: order.user?.license_number ? 'blue' : '#ccc', textAlign: 'center', fontWeight: 'bold' }}>
                      {order.user?.license_number || '-'}
                    </td>
                    <td>
                      <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem' }}>
                        {order.order_items?.map((item) => (
                          <li key={item.id}>
                            {item.weapon?.name} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td><strong>${Number(order.total_price).toLocaleString()}</strong></td>
                    <td>
                      <span style={{
                        padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold',
                        backgroundColor: 
                          order.status === OrderStatus.APPROVED ? '#ccffcc' : 
                          order.status === OrderStatus.REJECTED ? '#ffcccc' : '#fff3cd',
                        color: 
                          order.status === OrderStatus.APPROVED ? 'green' : 
                          order.status === OrderStatus.REJECTED ? 'red' : '#856404'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {order.status === OrderStatus.PENDING ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <button 
                            onClick={() => handleStatusUpdate(order.id, OrderStatus.APPROVED)}
                            style={{ 
                              backgroundColor: '#28a745', // สีเขียว
                              color: 'white', 
                              border: 'none', 
                              padding: '5px 10px', 
                              borderRadius: '5px', 
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(order.id, OrderStatus.REJECTED)}
                            style={{ 
                              backgroundColor: '#dc3545', // สีแดง
                              color: 'white', 
                              border: 'none', 
                              padding: '5px 10px', 
                              borderRadius: '5px', 
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#999', fontStyle: 'italic' }}>ดำเนินการแล้ว</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;