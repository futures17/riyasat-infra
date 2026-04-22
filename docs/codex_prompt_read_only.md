now intire fronted completed ab ate he apana backedn part par mene jo jo mds di he usko deeply read out karo sabse phele bohot jaida deeply uske bad prompt dena -
sabe phele jo dono froented or backend mds he usko read out karke samjo fir prompt ese ho-
meri baat diyan se suno kon kon se pages he apne pas-
1 . http://localhost:8080/

1.1 Let's find that place
you've been dreaming about
Schedule a private site visit and experience the serenity of Green Glades Estate firsthand. Our team will guide you through every aspect of your future sanctuary.

Book Site Visit btn he ye redner kar rha he booking form par  
Schedule Meeting btn he redner kar rha he contact us page par

is par apne par he -
1.2 - Share Your Experience 
Give us your feedback form jisne user starts , comment deta he ( apne gmail or number dal kar uske bad)
1.3 - Get in Touch 
We'd love to hear from you  form he ( ek contact form ki trah yah display hota he uske bad )

- bus aa jate he about us form par ( wah par koi form nahi he bus yah chije likhi hui he 2. -  http://localhost:8080/about (  
2.1 - Schedule a Private Tour 
Leave your details and our relationship manager will contact you within 24 hours to arrange an exclusive site visit.

Book Site Visit
Schedule Meeting) ( koi form nai he ye rednering kr rha he bus saem as 1.1 ) 

uske bad ate he 
event par 
3. - http://localhost:8080/events ( koi form nahi bus infor or vents or awards)
4. http://localhost:8080/projects
4.1 header par hi book a visit btn rakha hua he 
4.2 Escape the City Chaos.
Embrace Luxury.
Green Glades Estate is an exclusive sanctuary designed for those who seek the perfect balance between nature's tranquility and uncompromising luxury.

Book A Site Visit( btn)
4.3 Registry Ready
100% legal clarity with immediate registry and possession.

Asset Protection
Professional management for long-term value preservation.

Request Full Details( render to book a viist page) 
Consult Expert( render to contact us page)
4.4 Registry Ready
High Appreciation
Request Quote( book a visit page) 
View Plans(ye sirf niche scoll karta he or kuch nahi
uskebad - 4.5 Prime Connectivity 
Map & Location
Strategically situated on Raisen Road, Bhopal — just minutes away from major landmarks yet tucked away in nature's lap.

Book Site Visit
uske baad ( main ) - form a jata he - 4.6 - Get in Touch
yah form kya kaam karta he yab samjo
agar koi ko kuch pucnha he janna he about project to wah ye form krta he 
ek more change in backend - proejct par jo form he ye Full Name
Your name
Phone
+91
Email
name@gmail.com
Message
I'm interested in...
Send Enquiry ye iska  apne paas ab tak koi logic nahi hie

apan to ek or admin par chije add krwali he jo home or projct par rakhe gae Get in Touch pages ka data le kar add krege *( ye same as contact us page ki trah work karta he ) isme bhi data apan ko add krna he like admin ke pas ek project page hoga wah par admin project ke bare me dek saket he kon kon form bar rha he jo Get in Touch ka wah data or project ke bare me chije show hogi like in the future or project add honge to alag alag project ka data with form show hoga esa loic tha 
now prompt me ad karna ki admin par ek chij add kare project inquiry wah par home or projcet page ka Get in Touch ka data show hoga proper tarike se ek dam saaf sudra or sahi tarike se uske bad
ye form mene jo num dal dal ke bataye he wah to book or contact ko show kar re he logic apan ko show kara he ki - admin par agar koi use about us se contact us page par render ho kar form barata he to admin ko show ho ek chota sa side me - thorugh admin page
or agar koi same ese hi home page se contact book visit page par render ho tha he or project page se contac us or booking par reder ho kar form bar rha te to amdin ko show ho thorugh home page thoth project page esa show ho ek chota sa taki samaj aaye kis page se jaida user form bar re he esa logic he

2nd part - or apne paas admin par  job ( add job ka option bi nahi he ) uske bad 
is page ek form add karna tha wah bhi reh gya he - http://localhost:8080/auth/signup-member apply for job is par ek new page 


Join the Team
Choose your path to become part of the Riyasat legacy.

Create New Account
New here? Submit your KYC documents and personal details.

Already a Member?
Your Aadhar & PAN are already submitted physically. Register for portal access.

Already have an account? Login here · Help

iske niche ek or add karnha - already a member ke niche ek form add karna he apply for jobs usme ek page open hoga ki show hoga jo jo job sir dalege admin se or imgs bhi show hogi requremnt like - resume ,age ,adhar num , etx bhi ek msg me show hoga
uske bad agar koi candidte apply karta he to wah dta jayega admn ke applied job wale page par esa logic hoga 
admin me 2 new chije  add karni he proejct wali ( with form jo mene uper bataya) uske bad ( carrer page - add job - trace apply candidates) esa karna he or ui par koi chagnes apply nahi karni he admin or fornted part par sab phele se stable or swqured he koi isssue or chije nahi dalni he ek or chije ( abhi admin sequre nahi he bhai admin pe caroro ruay ke order ( booking se) millinors logo ka contact or info jayegi to sahi tarike se sewure krna he koi faltu admi admin ko kafi acess na kar jese jse bhi horha he - http://localhost:8080/admin
isko increpted karna he taki koi faltu intaal -
riyasat.com/admin na kar sake or admin koi link se bypas na ho webstie par or bohot sequred or stavle tairke se ho prompt me add karna me fir se bol rha hu ui sab me phele hi 25h laga kr final kar chuka hu imgs or jo jo jesa muje pansad he sab final kar diya he
note - abhi fully backend nahi bannana admin page actviate karna he admin par bhi phele se sayad 60-70% ui or backend inbuild he 30-40% bacha he phele usko kehena proper testing kare konsa data kha ja rha he vooking contact us or waki ka data kese sabe ho rha or ho bhi rah he ki nahi ho rha he verfiy krana he fir changes aplly karna he uske bad ssath hi me prepr traike se logic banan he admin ka ui or pheles e buoild system or hcije break nahi karni he sahi se kaam karna he sab ashi se ek dam testing aply karke note: jo jo db new add honge uska supabase comad muje denih e like - new 22 april subalase upadted,db uske esa bana kar ke sab sql or jo jo comds he add karni he abhi apne pas bohot bada sql databse created he supabae par phele se ese samjo mene codex se akele prompt se 3h me proper databbase bana diya 2600 line ka akela database bana chuka hu to usko samajaka koi chije chagne na kare sab proepr aply kare ek dam pure or sahi dang tarike se esa bolna ok muje prompt do final backend ka sahi se mds read karke agar codex tum prompt padh re ho to sahi se cheji apply karo
---------------------------------------------------------------------------------
You are now working as a **Senior Backend Architect on a LIVE PRODUCTION SYSTEM**.

You are NOT allowed to experiment, rebuild, or modify existing architecture blindly.

# 🚨 PRIMARY RULE

👉 DO NOT MODIFY EXISTING DATABASE STRUCTURE UNLESS REQUIRED
👉 DO NOT BREAK CURRENT WORKING FLOWS
👉 DO NOT TOUCH FRONTEND UI

You are ONLY allowed to:
✔ Verify
✔ Fix data flow
✔ Add missing backend logic
✔ Add minimal required tables
✔ Secure admin system
# 📚 STEP 1: READ BEFORE DOING ANYTHING

You MUST deeply read:
* FRONTEND_WORKFLOW.md
* BACKEND_WORKFLOW.md
* All /Features/*.md

Understand:

* Existing Supabase schema
* Data flow (contacts, visits, feedback)
* Admin dashboard structure
* Routing system

❌ If you skip reading → you will break system


# 🔍 STEP 2: SYSTEM AUDIT (MANDATORY)

Before writing ANY code:

Check these flows:

### 1. Contact Form

* `/contact`
* `/` (home contact section)
* `/projects` (Get in Touch)

👉 Verify:

* Is data inserting into `contacts` table?
* Is status = 'new'?
* Is data visible in admin?

---

### 2. Book Visit

* `/book-visit`
* All buttons redirecting here

👉 Verify:

* Data inserting into `visits`
* `visit_status = scheduled`
* `ref_id` handled correctly

---

### 3. Feedback

* Rating + comment

👉 Verify:

* Stored in `feedback`
* Fetch working or not

---

### 🚫 If ANY of above fails:

STOP and FIX FIRST

---

# 🧠 STEP 3: REQUIRED NEW FEATURES (NO EXTRA)

---

## 🔷 FEATURE 1: PROJECT INQUIRY TRACKING

### Problem:

Currently all forms go into `contacts`

### Required:

Create logic:

👉 Add column:

```
source_page TEXT
```

Values:

* home
* project
* contact

---

### Logic:

When form submitted:

* Home → source_page = 'home'
* Project → source_page = 'project'
* Contact → source_page = 'contact'

---

### Admin Panel:

Create new section:

👉 "Project Inquiries"

Display:

* Name
* Phone
* Message
* Source Page (badge)

Also show:

* Count by source

  * Home: X
  * Project: Y
  * Contact: Z

---

## 🔷 FEATURE 2: CAREER / JOB SYSTEM

---

### DATABASE ADDITIONS:

Create new tables:

### jobs

* id (uuid)
* title
* description
* category (enum)
* requirements (text)
* image_url
* created_at

---

### job_applications

* id (uuid)
* job_id (fk)
* full_name
* phone
* email
* gender
* resume_url (optional)
* status (new/reviewed/rejected/selected)
* created_at

---

## FRONTEND CONNECTION:

Page:
`/auth/signup-member`

Add:
👉 "Apply for Job"
Flow:

* Fetch jobs from DB
* Show job cards
* Click → open form
* Submit → insert into `job_applications`

## ADMIN PANEL ADD:

1. Add Job
2. View Jobs
3. View Applications

## 🔷 FEATURE 3: ADMIN SECURITY (CRITICAL)

Current system is NOT secure.

### IMPLEMENT:
#### 1. Protected Route
* `/admin` must require login
#### 2. Role Check

* Only `role = admin` allowed

#### 3. Session Validation
* Check Supabase session on load

### BLOCK:

❌ Direct URL access
❌ Unauthorized access
❌ Bypass routing
### OPTIONAL HARDENING:

* Middleware check
* Token validation before render
## 🔷 FEATURE 4: DATA FLOW CLARITY (ADMIN INSIGHT)
Add small metadata:
When data comes:
* attach:
  * source_page
  * timestamp
  * form_type (contact / visit / feedback)

Admin UI:
Show:
* Recent Activity Feed
* “From Project Page”
* “From Home Page”
# 🛑 STRICT RESTRICTIONS
You are NOT allowed to:
❌ Modify existing tables like users, roles, clients
❌ Rewrite DB schema
❌ Touch UI styling
❌ Add random APIs
❌ Disconnect Supabase
# 🧪 STEP 4: TESTING (MANDATORY)
Test manually:
1. Submit contact → appears in admin
2. Submit visit → appears in visits
3. Apply job → appears in applications
4. Admin login → protected
# 🧾 STEP 5: SQL OUTPUT (IMPORTANT)
For every DB change:
👉 Provide SQL in this format:
-- 22 April Update
ALTER TABLE contacts ADD COLUMN source_page TEXT;
CREATE TABLE jobs (...);
CREATE TABLE job_applications (...);
#  EXECUTION STYLE
* Work step by step
* No bulk coding
* No guessing
* If stuck → ASK

# 🚨 FAILURE CONDITION

If you:
* Break existing flow
* Modify wrong table
* Over-engineer

You FAILED.

# ✅ FINAL GOAL
* Stable backend
* Clean data flow
* Admin visibility
* Secure access
Start with SYSTEM AUDIT
Do NOT write code immediately
