import sqlite3
import json
import os
import time
from typing import List, Dict, Any, Optional

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(DB_DIR, "iris.db")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. User Profile Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iris_users (
        id VARCHAR(64) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'STUDENT',
        status VARCHAR(50) DEFAULT 'active',
        created_at VARCHAR(50) NOT NULL,
        learning_profile TEXT NOT NULL,
        PRIMARY KEY (id)
    )
    """)

    # 2. AI Specialized Tutors Table (referenced by iris_conversations)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iris_tutors (
        id VARCHAR(64) NOT NULL,
        name VARCHAR(150) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        role VARCHAR(150) NOT NULL,
        avatar VARCHAR(50) NOT NULL,
        personality TEXT NOT NULL,
        topics TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        PRIMARY KEY (id)
    )
    """)

    # 3. Authentication Sessions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iris_session (
        session_id VARCHAR(128) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        expires_at INT NOT NULL,
        device_signature VARCHAR(255) NOT NULL,
        created_at VARCHAR(50) NOT NULL,
        PRIMARY KEY (session_id),
        FOREIGN KEY (user_id) REFERENCES iris_users (id) ON DELETE CASCADE
    )
    """)

    # 4. AI Tutor Conversations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iris_conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id VARCHAR(64) NOT NULL,
        agent_id VARCHAR(64) NOT NULL,
        sender VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        timestamp VARCHAR(50) NOT NULL,
        mood_detected VARCHAR(50),
        interactive_widget TEXT,
        FOREIGN KEY (user_id) REFERENCES iris_users (id) ON DELETE CASCADE,
        FOREIGN KEY (agent_id) REFERENCES iris_tutors (id) ON DELETE CASCADE
    )
    """)

    # 5. Study Planner Tasks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iris_tasks (
        id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        duration INT NOT NULL,
        completed INT DEFAULT 0,
        priority VARCHAR(20) DEFAULT 'medium',
        scheduled_time VARCHAR(50) NOT NULL,
        created_at VARCHAR(50) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES iris_users (id) ON DELETE CASCADE
    )
    """)

    # 6. Learning DNA Progress Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iris_dna (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id VARCHAR(64) NOT NULL,
        score INT NOT NULL,
        stats TEXT NOT NULL,
        logs TEXT NOT NULL,
        updated_at VARCHAR(50) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES iris_users (id) ON DELETE CASCADE
    )
    """)

    # 7. Admin Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iris_audit_logs (
        id VARCHAR(64) NOT NULL,
        timestamp VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        actor VARCHAR(100) NOT NULL,
        action VARCHAR(150) NOT NULL,
        details TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Success',
        PRIMARY KEY (id)
    )
    """)

    conn.commit()

    # Seed sample data if iris_users is empty
    cursor.execute("SELECT COUNT(*) FROM iris_users")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor, conn)

    # Seed tutors if iris_tutors is empty
    cursor.execute("SELECT COUNT(*) FROM iris_tutors")
    if cursor.fetchone()[0] == 0:
        seed_tutors(cursor, conn)

    conn.close()

def seed_data(cursor: sqlite3.Cursor, conn: sqlite3.Connection):
    now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    now_time = time.strftime("%I:%M %p")

    # Seed users
    users = [
        (
            "usr_101",
            "Alex Mercer",
            "alex.mercer@stanford.edu",
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "STUDENT",
            "active",
            now_iso,
            json.dumps({
                "primaryGoal": "Software Engineering & Distributed Systems",
                "learningStyle": "Visual Chalkboard & Interactive Code",
                "dailyStudyMinutes": 60,
                "tutorTone": "Encouraging",
                "explanationDetail": "Detailed",
                "skillLevel": "Intermediate"
            })
        ),
        (
            "usr_102",
            "Elena Rostova",
            "elena.rostova@mit.edu",
            "c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0",
            "STUDENT",
            "active",
            now_iso,
            json.dumps({
                "primaryGoal": "Quantum Mechanics & Differential Equations",
                "learningStyle": "Step-by-Step Proofs & Formulas",
                "dailyStudyMinutes": 90,
                "tutorTone": "Academic",
                "explanationDetail": "Detailed",
                "skillLevel": "Advanced"
            })
        ),
        (
            "admin_01",
            "System Administrator",
            "admin@iris.edu",
            "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
            "ADMIN",
            "active",
            now_iso,
            json.dumps({
                "primaryGoal": "System Orchestration & Security Oversight",
                "learningStyle": "Analytical Architecture",
                "dailyStudyMinutes": 120,
                "tutorTone": "Socratic",
                "explanationDetail": "Concise",
                "skillLevel": "Advanced"
            })
        )
    ]
    cursor.executemany("""
    INSERT INTO iris_users (id, name, email, password_hash, role, status, created_at, learning_profile)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, users)

    # Seed active session
    cursor.execute("""
    INSERT INTO iris_session (session_id, user_id, expires_at, device_signature, created_at)
    VALUES (?, ?, ?, ?, ?)
    """, ("sess_live_99", "admin_01", int(time.time() * 1000) + 86400000, "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", now_iso))

    # Seed tasks
    tasks = [
        ("task_01", "usr_101", "Implement Dijkstra's Graph Search Algorithm", "Coding", 45, 1, "high", "10:00 AM", now_iso),
        ("task_02", "usr_101", "Eigenvalues & Diagonalization Practice Set", "Mathematics", 60, 0, "medium", "02:00 PM", now_iso),
        ("task_03", "usr_101", "Thermodynamics Carnot Engine Efficiency Review", "Science", 30, 0, "low", "05:30 PM", now_iso),
        ("task_04", "usr_102", "Harmonic Oscillator Schrödinger Equation Derivation", "Science", 90, 1, "high", "11:00 AM", now_iso),
    ]
    cursor.executemany("""
    INSERT INTO iris_tasks (id, user_id, title, subject, duration, completed, priority, scheduled_time, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, tasks)

    # Seed conversations
    conversations = [
        (
            "usr_101",
            "math",
            "user",
            "Can you explain how to solve this system of linear equations: 2x + 3y = 12 and x - y = 1?",
            now_time,
            "Curious",
            None
        ),
        (
            "usr_101",
            "math",
            "agent",
            "Let's solve this step-by-step using substitution! \n\nFrom equation (2): x = y + 1. Substituting into equation (1): 2(y + 1) + 3y = 12 -> 5y + 2 = 12 -> y = 2. Thus, x = 3.",
            now_time,
            "Encouraging",
            json.dumps({
                "type": "chalkboard",
                "data": {
                    "expression": "2x + 3y = 12 \\quad \\text{and} \\quad x - y = 1",
                    "solution": "x = 3, \\quad y = 2"
                }
            })
        ),
        (
            "usr_101",
            "code",
            "user",
            "How do I write a memoized Fibonacci function in Python?",
            now_time,
            "Focused",
            None
        ),
        (
            "usr_101",
            "code",
            "agent",
            "Here is the standard memoized solution utilizing a dictionary or Python's built-in `@functools.lru_cache` decorator.",
            now_time,
            "Helpful",
            json.dumps({
                "type": "code_editor",
                "data": {
                    "language": "python",
                    "code": "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fibonacci(n: int) -> int:\n    if n < 2:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(50))"
                }
            })
        )
    ]
    cursor.executemany("""
    INSERT INTO iris_conversations (user_id, agent_id, sender, content, timestamp, mood_detected, interactive_widget)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, conversations)

    # Seed DNA Progress
    cursor.execute("""
    INSERT INTO iris_dna (user_id, score, stats, logs, updated_at)
    VALUES (?, ?, ?, ?, ?)
    """, (
        "usr_101",
        88,
        json.dumps({
            "comprehension": 92,
            "learningSpeed": 85,
            "retentionRate": 89,
            "motivation": 94
        }),
        json.dumps([
            {"id": "log_1", "date": "2026-09-08", "score": 82, "activity": "Linear Algebra Mastery"},
            {"id": "log_2", "date": "2026-09-09", "score": 85, "activity": "Dynamic Programming Practice"},
            {"id": "log_3", "date": "2026-09-10", "score": 88, "activity": "Calculus & Derivatives Quiz"}
        ]),
        now_iso
    ))

    # Seed Audit Logs
    audit_logs = [
        ("log_001", now_iso, "Admin Login", "System Administrator", "User Authentication", "Admin session initialized successfully", "Success"),
        ("log_002", now_iso, "System Change", "System", "Database Initialization", "SQLite database tables verified and loaded", "Success"),
        ("log_003", now_iso, "AI Request", "Alex Mercer", "AI Tutor Query", "AI Math Tutor chalkboard consultation", "Success"),
    ]
    cursor.executemany("""
    INSERT INTO iris_audit_logs (id, timestamp, category, actor, action, details, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, audit_logs)

    conn.commit()

def seed_tutors(cursor: sqlite3.Cursor, conn: sqlite3.Connection):
    tutors = [
        (
            "math",
            "Mathematics Mentor",
            "Mathematics",
            "Expert Quantitative & Logical Reasoning Tutor",
            "📐",
            "Logical, structured, and step-by-step proofs. Solves equations showing all work and emphasizes final verified answers.",
            "Linear Equations, Quadratic Equations, Calculus, Differentiation, Integration, Linear Algebra, Probability",
            "active"
        ),
        (
            "science",
            "Science Explorer",
            "Science",
            "Interactive Simulation & Scientific Investigator",
            "🧪",
            "Empirical, inquiry-oriented, explains physical mechanisms, principles, cause-and-effect, and scientific phenomena.",
            "Newtonian Mechanics, Thermodynamics, Quantum Mechanics, Molecular Biology, Electricity & Magnetism",
            "active"
        ),
        (
            "code",
            "Coding Coach",
            "Computer Science & Coding",
            "Technical Architecture & Algorithm Specialist",
            "💻",
            "Practical, programming-focused, explains logic, writes idiomatic code, and provides systematic debugging checklists.",
            "Data Structures, Algorithms, Dynamic Programming, Python, TypeScript, System Design, Debugging",
            "active"
        ),
        (
            "lit",
            "Literature & Language Guide",
            "Literature & Language",
            "Rhetorical Stylist & Critical Analysis Guide",
            "✍️",
            "Language-focused, grammar, literary interpretation, rhetorical clarity, and structured academic writing.",
            "Grammar & Syntax, Literary Analysis, Essay Composition, Semantics, Rhetorical Devices",
            "active"
        ),
        (
            "career",
            "Career Navigator",
            "Career Strategy & Industry",
            "Strategic Career & Tech Placement Mentor",
            "🚀",
            "Professional, practical, skill-focused, career-roadmap oriented with clear milestones and interview strategies.",
            "Technical Interviews, Resume Strategy, Skill Gap Analysis, Industry Career Pathways, Portfolio Development",
            "active"
        ),
        (
            "research",
            "Research Assistant",
            "Academic Research & Methodology",
            "Scholarly Investigation & Methodology Expert",
            "🔬",
            "Academic, analytical, citation accuracy, rigorous research methodology, avoiding fabricated claims.",
            "Literature Review, Research Methodology, Hypothesis Formulation, APA/MLA Citation Formatting",
            "active"
        )
    ]
    cursor.executemany("""
    INSERT INTO iris_tutors (id, name, subject, role, avatar, personality, topics, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, tutors)
    conn.commit()

def get_database_stats() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    tables = ["iris_users", "iris_session", "iris_conversations", "iris_tasks", "iris_dna", "iris_audit_logs", "iris_tutors"]
    stats = {}
    total_rows = 0

    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        stats[table] = count
        total_rows += count

    file_size_bytes = os.path.getsize(DB_FILE) if os.path.exists(DB_FILE) else 0

    conn.close()

    return {
        "db_file": DB_FILE,
        "file_size_bytes": file_size_bytes,
        "file_size_kb": round(file_size_bytes / 1024, 2),
        "total_tables": len(tables),
        "total_rows": total_rows,
        "tables": stats
    }

def get_table_schema(table_name: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name})")
    rows = cursor.fetchall()

    cursor.execute(f"PRAGMA foreign_key_list({table_name})")
    fk_rows = cursor.fetchall()
    fk_map = {}
    for fk in fk_rows:
        # fk: (id, seq, table, from, to, on_update, on_delete, match)
        from_col = fk[3]
        target_tbl = fk[2]
        target_col = fk[4]
        fk_map[from_col] = f"{target_tbl}({target_col})"

    conn.close()

    schema = []
    for r in rows:
        col_name = r[1]
        schema.append({
            "cid": r[0],
            "name": col_name,
            "type": r[2],
            "notnull": bool(r[3]),
            "default_value": r[4],
            "pk": bool(r[5]),
            "fk": fk_map.get(col_name, None)
        })
    return schema

def get_table_data(table_name: str, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get total count
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    total_count = cursor.fetchone()[0]

    # Get rows
    cursor.execute(f"SELECT * FROM {table_name} LIMIT ? OFFSET ?", (limit, offset))
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description] if cursor.description else []

    data = [dict(row) for row in rows]
    conn.close()

    return {
        "table": table_name,
        "total_count": total_count,
        "limit": limit,
        "offset": offset,
        "columns": columns,
        "rows": data
    }

def execute_custom_query(sql_query: str) -> Dict[str, Any]:
    # Security: only allow SELECT queries
    trimmed = sql_query.strip().lower()
    if not trimmed.startswith("select") and not trimmed.startswith("pragma"):
        return {"error": "Only SELECT and PRAGMA queries are permitted in the read-only inspector."}

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        start_t = time.time()
        cursor.execute(sql_query)
        rows = cursor.fetchall()
        duration_ms = round((time.time() - start_t) * 1000, 2)
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        data = [dict(row) for row in rows]
        conn.close()
        return {
            "query": sql_query,
            "execution_time_ms": duration_ms,
            "row_count": len(data),
            "columns": columns,
            "rows": data
        }
    except Exception as e:
        conn.close()
        return {"error": str(e)}
