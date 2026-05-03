import { mockEvents } from "./data/mockEvents"
import Calendar from "./components/Calendar"

export default function Home() {
  return (
    <main className="flex flex-col items-center p-8">
      <Calendar/>
    </main>
  )
}