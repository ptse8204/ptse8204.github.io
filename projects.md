---
layout: page
title: Projects
subtitle: A project library that balances recruiter-readable summaries with enough depth for people who want the technical and domain story.
kicker: Project library
permalink: /projects/
---
{% assign featured_projects = site.data.projects | where: "category", "featured" %}
{% assign work_relevant_projects = site.data.projects | where: "category", "work_relevant" %}
{% assign domain_projects = site.data.projects | where: "category", "domain" %}
{% assign fun_projects = site.data.projects | where: "category", "fun" %}
{% assign archive_projects = site.data.projects | where: "category", "archive" %}

<div class="section-heading" data-reveal>
  <h2>Projects that connect current experience with the longer through-line of the site.</h2>
  <p>
    The older version of this portfolio had the right ingredients but not enough structure. This version keeps the transportation, planning, and curiosity-driven material, but organizes it around stronger summaries, cleaner categories, and clearer signals about why each project belongs here.
  </p>
</div>

<section id="featured-work">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Featured</p>
    <h2>Best entry points for recruiters and hiring managers.</h2>
    <p>These are the fastest paths into the strongest mix of systems work, product measurement, and distinctive domain context.</p>
  </div>
  <div class="project-grid project-grid--featured">
    {% for project in featured_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="work-relevant-technical-projects">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Work-relevant technical projects</p>
    <h2>Tools, analyses, and product-style builds that still reinforce the current role story.</h2>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in work_relevant_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="transportation-and-domain-work">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Transportation and domain work</p>
    <h2>Planning, policy, and systems thinking that make the portfolio feel like mine.</h2>
    <p>
      These projects are part of the site on purpose. They show the interests and constraints that shaped how I think about operations, incentives, throughput, fairness, and public-facing systems.
    </p>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in domain_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="fun-and-utility">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Fun and utility</p>
    <h2>Smaller experiments that still say something useful.</h2>
    <p>
      Not every project needs to be a flagship case study. Some are here because they show a habit of turning recurring annoyances into usable systems.
    </p>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in fun_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="archive-and-shelved">
  <div class="section-heading" data-reveal>
    <p class="section-kicker">Archive</p>
    <h2>Failed, dead, and shelved work still belongs in the story.</h2>
    <p>
      Most sites hide the projects that stalled. I keep them visible because unfinished work often explains more about judgment, iteration, and changing priorities than polished output alone.
    </p>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in archive_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>
