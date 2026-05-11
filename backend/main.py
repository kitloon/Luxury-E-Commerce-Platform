from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, text, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import List

# --- 数据库配置 ---
DATABASE_URL = "postgresql://postgres:admin123@127.0.0.1:5432/postgres"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 安全配置 ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "luxury-brand-secret-key"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# --- 数据库模型 ---
class UserDB(Base):
    __tablename__ = "users"
    username = Column(String, primary_key=True)
    password = Column(String)

class ProductDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Float)
    image_url = Column(String)
    category = Column(String)  # ← 新增 category 字段
    limited     = Column(Integer, default=0)    # 0 = normal, 1 = limited edition
    stock       = Column(Integer, default=999)  # stock quantity
    description = Column(String, default="")   # product description

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    product_id = Column(Integer)
    quantity = Column(Integer)
    price_at_purchase = Column(Float)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class CartDB(Base):
    __tablename__ = "cart"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    product_id = Column(Integer)
    quantity = Column(Integer, default=1)
    
# ── 2. New Pydantic schema ───────────────────────────────────────────────────
 
class ProductCreateRequest(BaseModel):
    name:        str
    price:       float
    image_url:   str
    category:    str
    limited:     bool = False
    stock:       int  = 999
    description: str  = ""

Base.metadata.create_all(bind=engine)

# --- 插入这段代码来手动更新数据库表 ---
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN limited INTEGER DEFAULT 0"))
        print("已添加 limited 字段")
    except Exception: pass
    
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 999"))
        print("已添加 stock 字段")
    except Exception: pass
    
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN description TEXT DEFAULT ''"))
        print("已添加 description 字段")
    except Exception: pass
    conn.commit()
# ------------------------------------

# --- 初始数据：12个产品，与前端 CATALOGUE 完全一致 ---
def init_db():
    db = SessionLocal()
    try:
        if not db.query(ProductDB).first():
            items = [
                ProductDB(id=1,  name='Structured Tote',      price=1200.0, category='Leather Goods', image_url='https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700'),
                ProductDB(id=2,  name='Mini Crossbody',        price=680.0,  category='Leather Goods', image_url='https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700'),
                ProductDB(id=3,  name='Leather Clutch',        price=490.0,  category='Leather Goods', image_url='https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=700'),
                ProductDB(id=4,  name='Auric Chronograph',     price=4500.0, category='Timepieces',    image_url='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700'),
                ProductDB(id=5,  name='Rose Complication',     price=6200.0, category='Timepieces',    image_url='https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700'),
                ProductDB(id=6,  name='Slim Dress Watch',      price=2800.0, category='Timepieces',    image_url='https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=700'),
                ProductDB(id=7,  name='Derby Oxford',          price=580.0,  category='Footwear',      image_url='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700'),
                ProductDB(id=8,  name='Suede Chelsea Boot',    price=720.0,  category='Footwear',      image_url='https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700'),
                ProductDB(id=9,  name='White Leather Sneaker', price=250.0,  category='Footwear',      image_url='https://images.unsplash.com/photo-1584000302558-756da5109f5b?w=700'),
                ProductDB(id=10, name='Pavé Bangle',           price=1900.0, category='Jewellery',     image_url='https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700'),
                ProductDB(id=11, name='Chain Necklace',        price=1100.0, category='Jewellery',     image_url='https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700'),
                ProductDB(id=12, name='Statement Ring',        price=820.0,  category='Jewellery',     image_url='https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=700'),
            ]
            db.add_all(items)
            db.commit()
    finally:
        db.close()

init_db()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token or session expired")

# --- Pydantic Schemas ---
class AuthSchema(BaseModel):
    username: str
    password: str

class CartAddRequest(BaseModel):
    product_id: int

# --- 认证路由 ---
@app.post("/signup")
def signup(user: AuthSchema, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.username == user.username).first():
        raise HTTPException(400, "User exists")
    db.add(UserDB(username=user.username, password=pwd_context.hash(user.password)))
    db.commit()
    return {"msg": "Success"}

@app.post("/login")
def login(user: AuthSchema, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(401, "Invalid credentials")
    token = jwt.encode({"sub": db_user.username, "exp": datetime.utcnow() + timedelta(hours=24)}, SECRET_KEY)
    return {"access_token": token}

# --- 商品路由 ---
@app.get("/products")
def get_prods(db: Session = Depends(get_db)):
    return db.query(ProductDB).all()

# --- 购物车路由 ---
@app.get("/cart")
def get_cart(username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartDB, ProductDB).join(
        ProductDB, CartDB.product_id == ProductDB.id
    ).filter(CartDB.username == username).all()

    result = []
    for cart_row, p in cart_items:
        result.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "image_url": p.image_url,
            "category": p.category,
            "quantity": cart_row.quantity,
        })
    return result

@app.post("/cart")
def add_to_cart(req: CartAddRequest, username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify product exists
    product = db.query(ProductDB).filter(ProductDB.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product id={req.product_id} not found")

    existing_item = db.query(CartDB).filter(CartDB.username == username, CartDB.product_id == req.product_id).first()
    if existing_item:
        existing_item.quantity += 1
    else:
        db.add(CartDB(username=username, product_id=req.product_id, quantity=1))
    db.commit()
    return {"msg": "Updated cart"}

@app.delete("/cart/{product_id}")
def remove_from_cart(product_id: int, username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartDB).filter(CartDB.username == username, CartDB.product_id == product_id).first()
    if item:
        if item.quantity > 1:
            item.quantity -= 1
        else:
            db.delete(item)
        db.commit()
        return {"msg": "Cart updated"}
    raise HTTPException(status_code=404, detail="Item not found")

# --- 结算路由 ---
@app.post("/checkout")
def checkout(username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartDB).filter(CartDB.username == username).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    for item in cart_items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        current_price = product.price if product else 0.0
        db.add(OrderDB(
            username=username,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=current_price,
            status="Paid"
        ))

    db.query(CartDB).filter(CartDB.username == username).delete()
    db.commit()
    return {"message": "Checkout successful"}

# --- 订单历史路由 ---
@app.get("/orders")
def get_orders(username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(OrderDB).filter(OrderDB.username == username).order_by(OrderDB.created_at.desc()).all()

    result = []
    for o in orders:
        p = db.query(ProductDB).filter(ProductDB.id == o.product_id).first()
        result.append({
            "id": o.id,
            "product_name": p.name if p else "Unknown Product",
            "quantity": o.quantity,
            "price_at_purchase": o.price_at_purchase,
            "status": o.status,
            "date": o.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    return result


# ── 3. New admin routes ──────────────────────────────────────────────────────
# Add these after your existing @app.get("/products") route:
 
@app.post("/products")
def create_product(
    req: ProductCreateRequest,
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Optional: restrict to admin users
    if username != "admin": raise HTTPException(403, "Forbidden")
    
    new_id = (db.query(func.max(ProductDB.id)).scalar() or 0) + 1
    p = ProductDB(
        id          = new_id,
        name        = req.name,
        price       = req.price,
        image_url   = req.image_url,
        category    = req.category,
        limited     = int(req.limited),
        stock       = req.stock,
        description = req.description,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p
 
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    req: ProductCreateRequest,
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    p.name        = req.name
    p.price       = req.price
    p.image_url   = req.image_url
    p.category    = req.category
    p.limited     = int(req.limited)
    p.stock       = req.stock
    p.description = req.description
    db.commit()
    db.refresh(p)
    return p
 
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    db.delete(p)
    db.commit()
    return {"msg": "Deleted"}
 