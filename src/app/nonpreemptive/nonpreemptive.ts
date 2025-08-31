import { Component } from '@angular/core';

interface Process {
  name: string;
  arrival: number;
  burst: number;
  priority: number;
  completion?: number;
  waiting?: number;
  turnaround?: number;
  start?: number;
  shownInQueue?: boolean;  // Track ready queue display
}

@Component({
  selector: 'app-nonpreemptive',
  templateUrl: './nonpreemptive.html',
  styleUrls: ['./nonpreemptive.css'],
  standalone: false
})
export class NonPreemptiveComponent {
  processes: Process[] = [];
  name = '';
  arrival: number | null = null;
  burst: number | null = null;
  priority: number | null = null;

  readyQueueBlocks: { name: string }[] = [];
  ganttChart: { name: string }[] = [];

  showResults = false;
  avgWT = 0;
  avgTAT = 0;

  addProcess() {
    if (!this.name || this.arrival == null || this.burst == null || this.priority == null) {
      alert("Please fill all fields.");
      return;
    }

    this.processes.push({
      name: this.name.trim(),
      arrival: this.arrival,
      burst: this.burst,
      priority: this.priority,
      shownInQueue: false
    });

    this.name = '';
    this.arrival = null;
    this.burst = null;
    this.priority = null;
    this.showResults = false;
  }

  remove(index: number) {
    if (confirm("Are you sure you want to delete this process?")) {
      this.processes.splice(index, 1);
    }
  }

  async simulate() {
    this.showResults = true;
    this.ganttChart = [];
    this.readyQueueBlocks = [];

    const queue: Process[] = [...this.processes];
    const completed: Process[] = [];
    let time = 0;

    while (queue.length > 0) {
      // Add arriving processes to ready queue (only once)
      for (const p of queue) {
        if (p.arrival <= time && !p.shownInQueue) {
          this.readyQueueBlocks.push({ name: p.name });
          p.shownInQueue = true;
          await this.delay(700); // Animation delay
        }
      }

      // Get processes available to run at this time
      const available = queue.filter(p => p.arrival <= time);

      if (available.length === 0) {
        this.ganttChart.push({ name: 'Idle' });
        await this.delay(600);
        time++;
        continue;
      }

      // Select highest priority process
      const current = available.reduce((a, b) => a.priority < b.priority ? a : b);
      current.start = time;
      current.completion = time + current.burst;
      current.turnaround = current.completion - current.arrival;
      current.waiting = current.start - current.arrival;

      // Animate each burst unit
      for (let i = 0; i < current.burst; i++) {
        this.ganttChart.push({ name: current.name });
        await this.delay(700);
        time++;
      }

      // Mark process as completed
      completed.push(current);
      const idx = queue.findIndex(p => p.name === current.name && p.arrival === current.arrival);
      if (idx > -1) queue.splice(idx, 1);
    }

    // Calculate results
    let totalWT = 0, totalTAT = 0;
    this.processes.forEach(p => {
      const match = completed.find(x => x.name === p.name && x.arrival === p.arrival);
      if (match) {
        p.completion = match.completion;
        p.waiting = match.waiting;
        p.turnaround = match.turnaround;
        totalWT += p.waiting!;
        totalTAT += p.turnaround!;
      }
    });

    this.avgWT = +(totalWT / this.processes.length).toFixed(2);
    this.avgTAT = +(totalTAT / this.processes.length).toFixed(2);

    document.querySelector(".gantt-section")?.scrollIntoView({ behavior: "smooth" });
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
