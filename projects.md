---
layout: page
title: Projects
subtitle: A project library spanning analytics engineering, product measurement, transportation, and practical tools.
kicker: Projects
permalink: /projects/
---
{% assign featured_projects = site.data.projects | where: "category", "featured" %}
{% assign work_relevant_projects = site.data.projects | where: "category", "work_relevant" %}
{% assign domain_projects = site.data.projects | where: "category", "domain" %}
{% assign fun_projects = site.data.projects | where: "category", "fun" %}
{% assign archive_projects = site.data.projects | where: "category", "archive" %}

<div class="section-heading" data-reveal>
  <h2>These projects show the mix of systems work and domain curiosity I keep coming back to.</h2>
  <p>
    Some are close to the work I do professionally. Others are here because they show how I think about public systems, incentives, and the gap between a clean model and real-world use.
  </p>
</div>

<section id="featured-work" class="project-section project-section--featured">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Selected work</p>
    <h2>The strongest entry points into my portfolio.</h2>
    <p>These projects best represent how I work across data systems, measurement, and transportation-linked analysis.</p>
  </div>
  <div class="project-grid project-grid--featured">
    {% for project in featured_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="work-relevant-technical-projects" class="project-section project-section--technical">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Technical projects</p>
    <h2>Tools and analyses that reinforce the same core strengths.</h2>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in work_relevant_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="transportation-and-domain-work" class="project-section project-section--domain">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Transportation and planning</p>
    <h2>I keep this work here because it shaped how I think about systems.</h2>
    <p>
      These projects sharpened how I think about throughput, incentives, public constraints, and the difference between technically possible solutions and the ones people can actually use.
    </p>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in domain_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="fun-and-utility" class="project-section project-section--small">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Smaller builds</p>
    <h2>Smaller projects, still built with the same instinct.</h2>
    <p>
      Not every useful project has to be large. Some are here because they show a habit of turning recurring annoyances into something more usable.
    </p>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in fun_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="archive-and-shelved" class="project-section project-section--archive">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Archive</p>
    <h2>Some unfinished work is still worth keeping visible.</h2>
    <p>
      I do not think a portfolio should only show polished wins. The archive is part of the record because it says something useful about feasibility, iteration, and judgment.
    </p>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in archive_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>
