"""
API для работы с товарами: получение списка, создание, обновление
"""
import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute("""
                SELECT 
                    p.id, p.title, p.price, p.category, p.description, 
                    p.location, p.image_emoji, p.views, p.verified_seller,
                    p.posted_at, u.name as seller_name, u.rating as seller_rating
                FROM products p
                JOIN users u ON p.seller_id = u.id
                ORDER BY p.posted_at DESC
            """)
            
            products = []
            for row in cur.fetchall():
                posted = row[9]
                now = datetime.now()
                diff = now - posted
                
                if diff.days == 0:
                    posted_str = 'Сегодня'
                elif diff.days == 1:
                    posted_str = '1 день назад'
                elif diff.days < 7:
                    posted_str = f'{diff.days} дня назад' if diff.days < 5 else f'{diff.days} дней назад'
                else:
                    posted_str = f'{diff.days // 7} недели назад' if diff.days < 14 else f'{diff.days // 7} недель назад'
                
                products.append({
                    'id': row[0],
                    'title': row[1],
                    'price': row[2],
                    'category': row[3],
                    'description': row[4],
                    'location': row[5],
                    'image': row[6],
                    'views': row[7],
                    'verified': row[8],
                    'posted': posted_str,
                    'seller': row[10],
                    'rating': float(row[11])
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'products': products})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            title = body.get('title')
            price = body.get('price')
            category = body.get('category')
            description = body.get('description')
            location = body.get('location')
            
            if not all([title, price, category, location]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            category_emojis = {
                'Электроника': '📱',
                'Одежда': '🧥',
                'Мебель': '🛋️',
                'Спорт': '🚴',
                'Детские товары': '🍼',
                'Авто': '🚗'
            }
            emoji = category_emojis.get(category, '📦')
            
            cur.execute("""
                INSERT INTO products (title, price, category, description, location, image_emoji, seller_id, verified_seller)
                VALUES (%s, %s, %s, %s, %s, %s, 1, TRUE)
                RETURNING id
            """, (title, price, category, description, location, emoji))
            
            product_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': product_id, 'message': 'Product created successfully'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
