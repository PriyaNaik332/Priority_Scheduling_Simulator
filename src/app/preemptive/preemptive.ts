import { Component } from '@angular/core';

interface Process {
  name: string;
  arrival: number;
  burst: number;
  priority: number;
  remaining: number;
  completion?: number;
  waiting?: number;
  turnaround?: number;
}
//comp is ui comp
@Component({
  selector: 'app-preemptive',
  templateUrl: './preemptive.html',
  styleUrls: ['./preemptive.css'],
  standalone:false // depends on other mod like FOrmsModule
})
export class PreemptiveComponent {
  processes: Process[] = []; //stores process
  name: string = '';
  arrival: number | null = null;
  burst: number | null = null;
  priority: number | null = null;

  ganttChart: { name: string }[] = [];
  readyQueueBlocks: { name: string }[] = [];

  showResults = false;
  totalTime = 0;
  avgWT = 0;
  avgTAT = 0;

  addProcess() {
   
   // validation   
    if (
      !this.name.trim() ||
      this.arrival === null ||
      this.burst === null ||
      this.priority === null ||
      this.arrival < 0 ||
      this.burst <= 0 ||
      this.priority < 0
    ) {
      alert('Please enter valid inputs.');
      return;
    }
//Gets stored here(object in array) in this arrayprocesses: any[] = []
    this.processes.push({
      name: this.name.trim(),
      arrival: this.arrival,
      burst: this.burst,
      priority: this.priority,
      remaining: this.burst
    });
//resets the form fields 
    this.name = '';
    this.arrival = null;
    this.burst = null;
    this.priority = null;
    this.showResults = false;
  }
//index: number (process to delete -its position in the processes array)
  remove(index: number) {
    if (confirm('Are you sure you want to delete this process?')) { //js
      this.processes.splice(index, 1); // removes 1 item at the given index.
    }
  }
async simulate() {
  this.showResults = true;
  this.ganttChart = [];
  this.readyQueueBlocks = [];

  const queue: Process[] = JSON.parse(JSON.stringify(this.processes)); //copy of this.processes,then we can  modify remaining, completion
  const completed: Process[] = [];          //Stores all finished processes -used to update original list later
  let time = 0;

  const arrivedSet = new Set<string>(); // which process arrived same process isnt added twice
//runs untill all processes complete
  while (queue.some(p => p.remaining > 0)) {
    // 1. Handle new arrivals at this time
    const newArrivals = queue.filter(p => p.arrival === time);//  processes that are arriving at this current time.
    for (const p of newArrivals) {
      if (!arrivedSet.has(p.name)) {
        this.readyQueueBlocks.push({ name: p.name });
        arrivedSet.add(p.name);
        await this.delay(500);
      }//if in arrivedset then donot add in readyqueueu otherwise add in readyqueue
    }

    // 2. Filter available processes (ready to run) already arrived still hv remaining(burst) time
    const available = queue.filter(p => p.arrival <= time && p.remaining > 0);
    //if nothing is thr skips to the next time
    if (available.length === 0) {
      this.ganttChart.push({ name: 'Idle' });
      await this.delay(500);
      time++;
      continue;
    }

    // 3. Pick highest priority available process push it into the gantchart reduce burst time
    const current = available.reduce((a, b) => a.priority < b.priority ? a : b);
    this.ganttChart.push({ name: current.name });
    current.remaining--;
    await this.delay(500);

    // 4. If finished, mark complete
    if (current.remaining === 0) {
      current.completion = time + 1;
      current.turnaround = current.completion - current.arrival;
      current.waiting = current.turnaround - current.burst;
      completed.push(current);
    }

    time++;
  }

  // Update original process list (checks in queue fr process and completed queue is checked if process name and 
  //arrival time matches compltion time .tat,wt,)
  let totalWT = 0, totalTAT = 0;
  this.processes.forEach(p => {
    const match = completed.find(x => x.name === p.name && x.arrival === p.arrival);
    if (match) {
      p.completion = match.completion;
      p.turnaround = match.turnaround;
      p.waiting = match.waiting;
      totalWT += p.waiting!;
      totalTAT += p.turnaround!;
    }
  });

  this.avgWT = +(totalWT / this.processes.length).toFixed(2);
  this.avgTAT = +(totalTAT / this.processes.length).toFixed(2);

  document.querySelector('.gantt-section')?.scrollIntoView({ behavior: 'smooth' });
}


//function delay  fr animation
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}