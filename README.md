# Shared Calendar

A full-stack collaborative scheduling web app that enables two users to create, view, edit, and delete shared calendar events with real-time synchronization.

**Live Demo:** [https://shared-calendar-nu.vercel.app](https://shared-calendar-nu.vercel.app)

## Features

- **Real-time Event Sync** — Changes instantly propagate to both users without page reloads via Supabase Realtime subscriptions
- **Google Calendar Integration** — Seamlessly sync events with Google Calendar; create/delete events directly from the app
- **OAuth 2.0 Authentication** — Secure per-user session management with NextAuth
- **Multi-day & All-day Events** — Full support for events spanning multiple days with proper date range handling
- **Color-coded Events** — Events are automatically color-coded by creator (you=blue, partner=pink) and event type (date night=purple)
- **Google Calendar Import** — Bulk import existing events from Google Calendar with automatic duplicate prevention
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices
- **Month & Day Views** — Switch between month view for overview and day view for detailed time slots
- **Link/Unlink Partner** — Easy one-time setup to link with your partner's calendar

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, React, Tailwind CSS
- **Calendar UI:** FullCalendar
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Real-time:** Supabase Realtime
- **Authentication:** NextAuth with Google OAuth 2.0
- **Google APIs:** Google Calendar API v3
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Cloud project with Calendar API enabled
- Supabase project
- GitHub account (for Vercel deployment)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shared-calendar.git
   cd shared-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # NextAuth
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Calendar Emails
   NEXT_PUBLIC_YOUR_EMAIL=your.email@gmail.com
   NEXT_PUBLIC_HER_EMAIL=partner.email@gmail.com
   ```

4. **Set up Supabase Database**
   
   Create these tables in Supabase:
   
   **events table:**
   ```sql
   CREATE TABLE events (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     start_time TEXT NOT NULL,
     end_time TEXT NOT NULL,
     created_by TEXT NOT NULL,
     google_event_id TEXT,
     is_date_night BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE INDEX idx_events_created_by ON events(created_by);
   ```
   
   **linked_users table:**
   ```sql
   CREATE TABLE linked_users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_a TEXT NOT NULL,
     user_b TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Set up Google OAuth**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials (type: Web Application)
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating an Event

1. Click on any date in the calendar
2. Enter the event title
3. Choose event type:
   - **Timed Event:** Select start and end times
   - **All Day:** Single or multiple days
   - **Date Night:** Auto-marked for special events
4. Submit — event syncs to both calendars instantly

### Importing from Google Calendar

1. Click the hamburger menu (☰)
2. Select "Import Google Calendar"
3. All existing events are imported (duplicates are automatically skipped)

### Linking with Your Partner

1. Click the hamburger menu (☰)
2. Select "Link Partner"
3. Enter your partner's email
4. They'll see your events, you'll see theirs

### Deleting an Event

1. Click on an event
2. Click "Delete Event" (only available for events you created)
3. Event is removed from both calendars

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts       # NextAuth OAuth setup
│   │   ├── create-event/route.ts              # Create events
│   │   ├── delete-event/route.ts              # Delete events
│   │   ├── get-events/route.ts                # Fetch all events
│   │   ├── import-google-calendar/route.ts    # Import from Google
│   │   ├── link-user/route.ts                 # Link partner
│   │   ├── check-link/route.ts                # Check link status
│   │   └── unlink/route.ts                    # Unlink partner
│   ├── globals.css                            # Styling + FullCalendar customization
│   ├── layout.tsx                             # Root layout
│   └── page.tsx                               # Main page
├── components/
│   ├── Calendar.tsx                           # Main calendar component
│   ├── TimePickerModal.tsx                    # Start time picker
│   ├── EndTimePickerModal.tsx                 # End time picker
│   ├── EventTitleModal.tsx                    # Event name input
│   ├── EventDetailModal.tsx                   # Event details & delete
│   ├── LinkModal.tsx                          # Link/unlink partner
│   ├── MenuBar.tsx                            # Top menu
│   ├── wheel-picker.tsx                       # Time wheel picker
│   └── Modal.css                              # Modal styling
└── lib/
    ├── supabase.ts                            # Supabase client
    └── utils.ts                               # Utilities
```

## Deployment

This app is deployed on [Vercel](https://vercel.com) with automatic CI/CD from GitHub.

### Deploy Your Own

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables (same as `.env.local`)
4. Deploy

After deployment, update Google OAuth redirect URI in Google Cloud Console:
```
https://your-vercel-url.vercel.app/api/auth/callback/google
```

## Known Limitations

- **Token Expiry:** Google access tokens expire after ~1 hour. You'll need to sign out and back in to refresh
- **One-way Sync:** Deleting events in Google Calendar doesn't sync back to the app (requires webhooks + permanent URL)
- **Two Users Only:** Designed specifically for couples; not a multi-user app
- **RLS Disabled:** Supabase Row-Level Security is currently disabled for simplicity

## Future Enhancements

- [ ] Implement refresh token rotation to avoid sign-out/sign-in cycles
- [ ] Add event editing capability
- [ ] Support recurring events
- [ ] Email/push notifications for events
- [ ] Enable Supabase RLS with proper security policies
- [ ] Add event notes and attachments

## Contributing

This is a personal project, but feel free to fork it and adapt it for your own use!

## License

MIT

## Questions?

If you have questions or run into issues, feel free to open an issue on GitHub.

---
