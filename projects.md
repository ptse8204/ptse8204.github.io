---
layout: page
title: Projects
subtitle: Selected work across analytics engineering, product measurement, transportation, and practical tools.
kicker: Projects
permalink: /projects/
visual_variant: projects
visual_density: high
---
{% assign featured_projects = site.data.projects | where: "category", "featured" %}
{% assign work_relevant_projects = site.data.projects | where: "category", "work_relevant" %}
{% assign domain_projects = site.data.projects | where: "category", "domain" %}
{% assign fun_projects = site.data.projects | where: "category", "fun" %}
{% assign archive_projects = site.data.projects | where: "category", "archive" %}

<div class="section-heading section-heading--split" data-reveal>
  <h2>Projects across data systems, measurement, and domain analysis.</h2>
  <p>
    Together they show how I approach reliability, incentives, and the gap between a clean model and real-world use.
  </p>
</div>

<section id="featured-work" class="project-section project-section--featured">
  <div class="section-heading section-heading--split" data-reveal>
    <p class="section-kicker">Selected work</p>
    <h2>The strongest entry points into my work.</h2>
    <p>These projects best represent how I approach data systems, measurement, and transportation-linked analysis.</p>
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
    <h2>Tools and analyses that extend the same core strengths.</h2>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in work_relevant_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="transportation-and-domain-work" class="project-section project-section--domain">
  <div class="section-heading section-heading--split" data-reveal>
    <p class="section-kicker">Transportation and planning</p>
    <h2>Transportation and planning work that informs my systems perspective.</h2>
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
  <div class="section-heading section-heading--split" data-reveal>
    <p class="section-kicker">Smaller builds</p>
    <h2>Smaller projects with clear utility.</h2>
    <p>
      These are lighter-weight builds that solve recurring problems cleanly and with minimal overhead.
    </p>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in fun_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section id="archive-and-shelved" class="project-section project-section--archive">
  <div class="section-heading section-heading--split" data-reveal>
    <p class="section-kicker">Archive</p>
    <h2>Archived work that still reflects judgment and range.</h2>
    <p>
      Not every worthwhile project becomes a flagship case study. The archive captures ideas that clarified feasibility, iteration, and trade-offs.
    </p>
  </div>
  <div class="project-grid project-grid--secondary">
    {% for project in archive_projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>
