from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class LinkedinBrandingCrew():
    """LinkedIn Branding Crew"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def trend_researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['trend_researcher'],
            verbose=True
        )

    @agent
    def content_writer(self) -> Agent:
        return Agent(
            config=self.agents_config['content_writer'],
            verbose=True
        )

    @agent
    def hashtag_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['hashtag_specialist'],
            verbose=True
        )

    @task
    def trend_research_task(self) -> Task:
        return Task(
            config=self.tasks_config['trend_research_task'],
        )

    @task
    def content_creation_task(self) -> Task:
        return Task(
            config=self.tasks_config['content_creation_task'],
        )

    @task
    def hashtag_task(self) -> Task:
        return Task(
            config=self.tasks_config['hashtag_task'],
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )