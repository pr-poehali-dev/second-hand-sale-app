"""
API для системы верификации пользователей: подача заявок, проверка статуса
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
            query_params = event.get('queryStringParameters', {}) or {}
            user_id = query_params.get('user_id')
            
            if user_id:
                cur.execute("""
                    SELECT 
                        vr.id, vr.status, vr.phone, vr.email, 
                        vr.document_type, vr.submitted_at, vr.reviewed_at,
                        vr.rejection_reason,
                        u.name, u.verified, u.verification_level
                    FROM verification_requests vr
                    JOIN users u ON vr.user_id = u.id
                    WHERE vr.user_id = %s
                    ORDER BY vr.submitted_at DESC
                    LIMIT 1
                """, (user_id,))
                
                row = cur.fetchone()
                
                if row:
                    result = {
                        'id': row[0],
                        'status': row[1],
                        'phone': row[2],
                        'email': row[3],
                        'document_type': row[4],
                        'submitted_at': row[5].isoformat() if row[5] else None,
                        'reviewed_at': row[6].isoformat() if row[6] else None,
                        'rejection_reason': row[7],
                        'user_name': row[8],
                        'verified': row[9],
                        'verification_level': row[10]
                    }
                else:
                    cur.execute("""
                        SELECT name, verified, verification_level
                        FROM users WHERE id = %s
                    """, (user_id,))
                    user_row = cur.fetchone()
                    
                    if user_row:
                        result = {
                            'status': 'none',
                            'user_name': user_row[0],
                            'verified': user_row[1],
                            'verification_level': user_row[2]
                        }
                    else:
                        cur.close()
                        conn.close()
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'User not found'})
                        }
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(result)
                }
            else:
                cur.execute("""
                    SELECT 
                        vr.id, vr.user_id, vr.status, vr.phone, vr.email,
                        vr.submitted_at, u.name, u.rating
                    FROM verification_requests vr
                    JOIN users u ON vr.user_id = u.id
                    WHERE vr.status = 'pending'
                    ORDER BY vr.submitted_at ASC
                """)
                
                requests = []
                for row in cur.fetchall():
                    requests.append({
                        'id': row[0],
                        'user_id': row[1],
                        'status': row[2],
                        'phone': row[3],
                        'email': row[4],
                        'submitted_at': row[5].isoformat() if row[5] else None,
                        'user_name': row[6],
                        'user_rating': float(row[7]) if row[7] else 0.0
                    })
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'requests': requests})
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            user_id = body.get('user_id')
            phone = body.get('phone')
            email = body.get('email')
            document_type = body.get('document_type')
            document_number = body.get('document_number')
            
            if not all([user_id, phone, email, document_type, document_number]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            cur.execute("""
                SELECT id FROM verification_requests 
                WHERE user_id = %s AND status = 'pending'
            """, (user_id,))
            
            if cur.fetchone():
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Pending request already exists'})
                }
            
            cur.execute("""
                INSERT INTO verification_requests 
                (user_id, phone, email, document_type, document_number, status)
                VALUES (%s, %s, %s, %s, %s, 'pending')
                RETURNING id
            """, (user_id, phone, email, document_type, document_number))
            
            request_id = cur.fetchone()[0]
            
            cur.execute("""
                UPDATE users 
                SET phone = %s, email = %s
                WHERE id = %s
            """, (phone, email, user_id))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': request_id, 'message': 'Verification request submitted'})
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            request_id = body.get('request_id')
            action = body.get('action')
            rejection_reason = body.get('rejection_reason')
            
            if not request_id or action not in ['approve', 'reject']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid request'})
                }
            
            cur.execute("SELECT user_id FROM verification_requests WHERE id = %s", (request_id,))
            result = cur.fetchone()
            
            if not result:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Request not found'})
                }
            
            user_id = result[0]
            
            if action == 'approve':
                cur.execute("""
                    UPDATE verification_requests 
                    SET status = 'approved', reviewed_at = NOW()
                    WHERE id = %s
                """, (request_id,))
                
                cur.execute("""
                    UPDATE users 
                    SET verified = TRUE, verification_level = 'verified'
                    WHERE id = %s
                """, (user_id,))
                
                cur.execute("""
                    UPDATE products 
                    SET verified_seller = TRUE
                    WHERE seller_id = %s
                """, (user_id,))
            else:
                cur.execute("""
                    UPDATE verification_requests 
                    SET status = 'rejected', reviewed_at = NOW(), rejection_reason = %s
                    WHERE id = %s
                """, (rejection_reason, request_id))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': f'Request {action}d successfully'})
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
