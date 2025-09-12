// Fetch and analyze the Jira project backlog CSV
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jira_fullstack_project_combined_seconds-KMofnUOj1zZlU3gYpP9fEE4Xq280h9.csv"

async function analyzeBacklog() {
  try {
    console.log("[v0] Fetching CSV data...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("[v0] Parsing CSV data...")
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    const tasks = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
        const task = {}
        headers.forEach((header, index) => {
          task[header] = values[index] || ""
        })
        tasks.push(task)
      }
    }

    console.log("[v0] Total tasks found:", tasks.length)

    // Analyze task priorities and status
    const todoTasks = tasks.filter((task) => task.Status === "To Do")
    const inProgressTasks = tasks.filter((task) => task.Status === "In Progress")
    const doneTasks = tasks.filter((task) => task.Status === "Done")

    console.log("[v0] Task Status Breakdown:")
    console.log("- To Do:", todoTasks.length)
    console.log("- In Progress:", inProgressTasks.length)
    console.log("- Done:", doneTasks.length)

    // Show high priority tasks (sorted by story points)
    const priorityTasks = todoTasks
      .filter((task) => task["Story Points"] && Number.parseFloat(task["Story Points"]) > 0)
      .sort((a, b) => Number.parseFloat(b["Story Points"]) - Number.parseFloat(a["Story Points"]))
      .slice(0, 10)

    console.log("\n[v0] Top Priority Tasks (To Do):")
    priorityTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.Summary}`)
      console.log(`   Description: ${task.Description}`)
      console.log(`   Story Points: ${task["Story Points"]}`)
      console.log(`   Labels: ${task.Labels}`)
      console.log("")
    })

    // Analyze task types
    const taskTypes = {}
    tasks.forEach((task) => {
      const type = task["Issue Type"] || "Unknown"
      taskTypes[type] = (taskTypes[type] || 0) + 1
    })

    console.log("[v0] Task Types:")
    Object.entries(taskTypes).forEach(([type, count]) => {
      console.log(`- ${type}: ${count}`)
    })

    // Show current sprint tasks
    const currentSprintTasks = tasks.filter(
      (task) => task.Sprint && task.Sprint.includes("Sprint") && task.Status !== "Done",
    )

    console.log("\n[v0] Current Sprint Tasks:")
    currentSprintTasks.forEach((task) => {
      console.log(`- ${task.Summary} (${task.Status})`)
    })

    return {
      totalTasks: tasks.length,
      todoTasks: todoTasks.length,
      inProgressTasks: inProgressTasks.length,
      doneTasks: doneTasks.length,
      priorityTasks,
      taskTypes,
      currentSprintTasks,
    }
  } catch (error) {
    console.error("[v0] Error analyzing backlog:", error)
  }
}

// Run the analysis
analyzeBacklog()
