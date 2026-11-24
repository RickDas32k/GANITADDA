import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { sqlClient, isDbConfigured } from '@/lib/db';
import { unauthorized } from '@/lib/http';

export interface AdminUserData {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  role: string;
  is_active: boolean;
  created_at: string;
  total_spent_paise: number;
  purchased_items: Array<{
    worksheet_id: string;
    title: string;
    class_level: string;
    chapter: string;
    price_paise: number;
    order_number: string;
    purchased_at: string;
  }>;
}

const MOCK_USERS: AdminUserData[] = [
  {
    id: 'user_mock_1',
    full_name: 'Ananya Sen',
    email: 'ananya.sen@gmail.com',
    mobile: '9874169625',
    role: 'CUSTOMER',
    is_active: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    total_spent_paise: 24800, // ₹248
    purchased_items: [
      {
        worksheet_id: 'ws_x_real_numbers',
        title: 'Real Numbers & Fundamental Arithmetic Mastery',
        class_level: 'X',
        chapter: 'Real Numbers',
        price_paise: 9900,
        order_number: 'GA-202611-4821',
        purchased_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        worksheet_id: 'ws_x_polynomials',
        title: 'Polynomials & Quadratic Equations Comprehensive Set',
        class_level: 'X',
        chapter: 'Polynomials',
        price_paise: 14900,
        order_number: 'GA-202611-4821',
        purchased_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'user_mock_2',
    full_name: 'Vikram Joshi',
    email: 'vikram.joshi@outlook.com',
    mobile: '9830554433',
    role: 'CUSTOMER',
    is_active: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    total_spent_paise: 39800, // ₹398
    purchased_items: [
      {
        worksheet_id: 'ws_xii_calculus',
        title: 'Calculus, Integrals & Differential Equations Exemplar',
        class_level: 'XII',
        chapter: 'Integrals',
        price_paise: 19900,
        order_number: 'GA-202611-3914',
        purchased_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        worksheet_id: 'ws_xii_matrices',
        title: 'Matrices & Determinants Board Exam Problem Set',
        class_level: 'XII',
        chapter: 'Matrices',
        price_paise: 19900,
        order_number: 'GA-202611-3914',
        purchased_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'user_mock_3',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    mobile: '9811223344',
    role: 'CUSTOMER',
    is_active: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    total_spent_paise: 9900, // ₹99
    purchased_items: [
      {
        worksheet_id: 'ws_x_triangles',
        title: 'Triangles & Coordinate Geometry Practice Problems',
        class_level: 'X',
        chapter: 'Triangles',
        price_paise: 9900,
        order_number: 'GA-202611-2802',
        purchased_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'user_mock_4',
    full_name: 'Sneha Das',
    email: 'sneha.das@gmail.com',
    mobile: '9822334455',
    role: 'CUSTOMER',
    is_active: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    total_spent_paise: 19800, // ₹198
    purchased_items: [
      {
        worksheet_id: 'ws_ix_linear_equations',
        title: 'Linear Equations in Two Variables Practice Kit',
        class_level: 'IX',
        chapter: 'Linear Equations',
        price_paise: 9900,
        order_number: 'GA-202611-1904',
        purchased_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        worksheet_id: 'ws_ix_surface_areas',
        title: 'Surface Areas and Volumes Step-by-Step Worksheet',
        class_level: 'IX',
        chapter: 'Surface Areas and Volumes',
        price_paise: 9900,
        order_number: 'GA-202611-1904',
        purchased_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'user_mock_5',
    full_name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    mobile: '9944556677',
    role: 'CUSTOMER',
    is_active: true,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    total_spent_paise: 0,
    purchased_items: [],
  },
];

export async function GET() {
  if (!(await isAdmin())) return unauthorized();

  if (!isDbConfigured()) {
    return NextResponse.json(MOCK_USERS);
  }

  try {
    const sql = sqlClient();

    // 1. Fetch users
    const users = await sql`
      SELECT id, email, full_name, mobile, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
    `;

    if (!users || users.length === 0) {
      return NextResponse.json(MOCK_USERS);
    }

    // 2. Fetch all purchased items for successful orders
    const items = await sql`
      SELECT 
        o.user_id,
        o.order_number,
        o.created_at as order_created_at,
        oi.worksheet_id,
        oi.worksheet_title,
        oi.worksheet_class,
        oi.chapter,
        oi.price_paise
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.status = 'SUCCESS'
      ORDER BY o.created_at DESC
    `;

    // Group items by user_id
    const userPurchasesMap = new Map<string, Array<{
      worksheet_id: string;
      title: string;
      class_level: string;
      chapter: string;
      price_paise: number;
      order_number: string;
      purchased_at: string;
    }>>();

    for (const item of items) {
      const uId = String(item.user_id);
      if (!userPurchasesMap.has(uId)) {
        userPurchasesMap.set(uId, []);
      }
      userPurchasesMap.get(uId)!.push({
        worksheet_id: String(item.worksheet_id),
        title: item.worksheet_title || 'Worksheet',
        class_level: item.worksheet_class || '',
        chapter: item.chapter || '',
        price_paise: Number(item.price_paise || 0),
        order_number: item.order_number || '',
        purchased_at: item.order_created_at,
      });
    }

    // Build complete user records with purchased items and total spent
    const result: AdminUserData[] = users.map((u: any) => {
      const uId = String(u.id);
      const userPurchases = userPurchasesMap.get(uId) || [];
      const totalSpent = userPurchases.reduce((acc, curr) => acc + curr.price_paise, 0);

      return {
        id: uId,
        full_name: u.full_name || 'Student',
        email: u.email,
        mobile: u.mobile || '',
        role: u.role || 'CUSTOMER',
        is_active: u.is_active !== false,
        created_at: u.created_at,
        total_spent_paise: totalSpent,
        purchased_items: userPurchases,
      };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.warn('[Admin Users DB Error, fallback to mock]:', err?.message || err);
    return NextResponse.json(MOCK_USERS);
  }
}
