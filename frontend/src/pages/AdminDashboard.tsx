// frontend/src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { getWeapons, createWeapon, updateWeapon, deleteWeapon } from '../api/weaponApi';
import { getAllOrders, updateOrderStatus } from '../api/orderApi';
import type { Weapon, WeaponPayload, Order } from '../types';
import { OrderStatus } from '../types';
import { toast } from 'react-toastify';

// ✅ Interface พิเศษสำหรับหน้านี้
interface AdminOrder extends Order {
  user?: {
    username: string;
    email?: string;
  };
}

const AdminDashboard = () => {
  // ✅ State สำหรับสลับ Tab
  const [activeTab, setActiveTab] = useState<'weapons' | 'orders'>('weapons');

  // --- State ส่วน Weapons ---
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loadingWeapons, setLoadingWeapons] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  // 1. เพิ่ม image เข้าไปใน State เริ่มต้น
  const [formData, setFormData] = useState<WeaponPayload>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'light',
    required_license_level: 1,
    image: '', // <--- เพิ่มตรงนี้
  });

  // --- State ส่วน Orders ---
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // ✅ Fetch Weapons
  const fetchWeapons = async () => {
    try {
      setLoadingWeapons(true);
      const data = await getWeapons();
      setWeapons(data);
    } catch (error) {
      toast.error('ไม่สามารถดึงข้อมูลอาวุธได้');
    } finally {
      setLoadingWeapons(false);
    }
  };

  // ✅ Fetch Orders
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
    // 2. ดึงข้อมูลรูปภาพมาใส่ใน Form ตอนกดแก้ไข
    setFormData({
      name: weapon.name,
      description: weapon.description,
      price: Number(weapon.price),
      stock: weapon.stock,
      category: weapon.category,
      required_license_level: weapon.required_license_level,
      image: weapon.image || '', // <--- เพิ่มตรงนี้
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    // 3. Reset ค่ารูปภาพเมื่อกดปุ่มยกเลิกหรือบันทึกเสร็จ
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'light',
      required_license_level: 1,
      image: '', // <--- เพิ่มตรงนี้
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
    <div className="container" style={{ marginTop: '20px' }}>
      <h1>Admin Dashboard</h1>

      {/* ✅ Tab Menu */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('weapons')}
          className="btn-primary"
          style={{ opacity: activeTab === 'weapons' ? 1 : 0.6, cursor: 'pointer' }}
        >
          จัดการคลังอาวุธ
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className="btn-primary"
          style={{ opacity: activeTab === 'orders' ? 1 : 0.6, cursor: 'pointer' }}
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
              
              {/* ชื่ออาวุธ */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label>ชื่ออาวุธ:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" />
              </div>

              {/* 4. เพิ่มช่องกรอก URL รูปภาพ */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label>URL รูปภาพสินค้า:</label>
                <input 
                  type="text" 
                  name="image" 
                  value={formData.image || ''} 
                  onChange={handleChange} 
                  placeholder="เช่น https://example.com/gun.jpg"
                  className="input-field" 
                />
              </div>

              {/* รายละเอียด */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label>รายละเอียด:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required className="input-field" rows={3} />
              </div>
              
              {/* ราคา & Stock */}
              <div>
                <label>ราคา ($):</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label>จำนวนในคลัง:</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="input-field" />
              </div>
              
              {/* หมวดหมู่ & License */}
              <div>
                <label>หมวดหมู่:</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  <option value="light">Light</option>
                  <option value="heavy">Heavy</option>
                  <option value="explosive">Explosive</option>
                </select>
              </div>
              <div>
                <label>เลเวลใบอนุญาตที่ต้องใช้:</label>
                <input type="number" name="required_license_level" value={formData.required_license_level} onChange={handleChange} required className="input-field" />
              </div>
              
              {/* Buttons */}
              <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ marginRight: '10px' }}>
                  {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มอาวุธ'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card" style={{ marginTop: '20px', overflowX: 'auto', color: 'black' }}>
            <h3>รายการอาวุธทั้งหมด ({weapons.length})</h3>
            {loadingWeapons ? <p>Loading...</p> : (
              <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#eee' }}>
                    <th style={{ width: '80px' }}>รูปภาพ</th> {/* เพิ่ม Header รูปภาพ */}
                    <th>ชื่อ</th>
                    <th>ราคา</th>
                    <th>Stock</th>
                    <th>หมวดหมู่</th>
                    <th>License</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {weapons.map((w) => (
                    <tr key={w.id}>
                      {/* 5. แสดงรูปภาพ thumbnail ในตาราง */}
                      <td style={{ textAlign: 'center' }}>
                        {w.image ? (
                           <img 
                             src={w.image} 
                             alt="preview" 
                             style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                             onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} // ซ่อนถ้ารูปเสีย
                           />
                        ) : (
                           <span style={{ fontSize: '10px', color: '#999' }}>ไม่มีรูป</span>
                        )}
                      </td>
                      <td>
                        <strong>{w.name}</strong><br/>
                        <small style={{color: '#666'}}>{w.description.substring(0, 50)}...</small>
                      </td>
                      <td>${Number(w.price).toLocaleString()}</td>
                      <td>{w.stock}</td>
                      <td>
                        <span style={{ 
                          padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                          backgroundColor: w.category === 'explosive' ? '#ffcccc' : w.category === 'heavy' ? '#e6ccff' : '#ccffcc' 
                        }}>
                          {w.category.toUpperCase()}
                        </span>
                      </td>
                      <td style={{textAlign: 'center'}}>{w.required_license_level}</td>
                      <td style={{textAlign: 'center'}}>
                        <button onClick={() => startEdit(w)} style={{ marginRight: '5px', cursor: 'pointer' }}>✏️ แก้ไข</button>
                        <button onClick={() => handleDelete(w.id)} style={{ color: 'red', cursor: 'pointer' }}>🗑️ ลบ</button>
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
        <div className="card" style={{ marginTop: '20px', overflowX: 'auto', color: 'black' }}>
          <h3>รายการคำสั่งซื้อ ({orders.length})</h3>
          {loadingOrders ? <p>Loading...</p> : (
            <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                  <th>Order ID</th>
                  <th>ลูกค้า</th>
                  <th>รายการสินค้า</th>
                  <th>ยอดรวม</th>
                  <th>สถานะ</th>
                  <th>วันที่สั่ง</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><small>{order.id.substring(0, 8)}...</small></td>
                    <td>{order.user?.username || 'Unknown'}</td>
                    <td>
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {order.order_items?.map((item) => (
                          <li key={item.id}>
                            {item.weapon?.name || 'Item'} x {item.quantity}
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
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      {order.status === OrderStatus.PENDING && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            onClick={() => handleStatusUpdate(order.id, OrderStatus.APPROVED)}
                            style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(order.id, OrderStatus.REJECTED)}
                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {order.status !== OrderStatus.PENDING && <span style={{ color: '#999' }}>ดำเนินการแล้ว</span>}
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