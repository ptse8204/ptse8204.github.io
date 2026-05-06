---
layout: page
title: Projects
subtitle: "Data systems, analysis tools, and planning work with enough shape to judge the decisions behind them."
kicker: Projects
permalink: /projects/
visual_variant: projects
visual_density: low
---
{% assign featured_projects = site.data.projects | where: "category", "featured" %}
{% assign work_relevant_projects = site.data.projects | where: "category", "work_relevant" %}
{% assign domain_projects = site.data.projects | where: "category", "domain" %}
{% assign fun_projects = site.data.projects | where: "category", "fun" %}
{% assign archive_projects = site.data.projects | where: "category", "archive" %}
{% assign more_builds_count = work_relevant_projects.size | plus: fun_projects.size | plus: domain_projects.size %}

<section id="featured-work" class="project-section project-section--featured">
  <div class="section-heading section-heading--split" data-reveal>
    <h2>Featured projects</h2>
    <p>Work samples focused on the operating problem, the model, and the interface that made the work easier to use.</p>
  </div>
  {% if featured_projects and featured_projects.size > 0 %}
    <div class="project-grid project-grid--featured" data-disclosure-group>
      {% for project in featured_projects %}
        {% include project-card.html project=project %}
      {% endfor %}
    </div>
  {% else %}
    <article class="frame-card" data-reveal>
      <h2>Featured work is being refreshed.</h2>
      <p>Project entries are temporarily unavailable here. Check back after the next content update.</p>
    </article>
  {% endif %}
</section>

<section id="more-builds" class="project-section project-section--technical">
  <div class="section-heading" data-reveal>
    <h2>More projects</h2>
    <p>Additional builds, research, and utility projects across analytics, transportation, policy, and automation.</p>
  </div>
  {% if more_builds_count > 0 %}
    <div class="project-grid project-grid--secondary" data-disclosure-group>
      {% for project in work_relevant_projects %}
        {% include project-card.html project=project %}
      {% endfor %}
      {% for project in fun_projects %}
        {% include project-card.html project=project %}
      {% endfor %}
      {% for project in domain_projects %}
        {% include project-card.html project=project %}
      {% endfor %}
    </div>
  {% else %}
    <p data-reveal>Additional projects will appear here once they are ready.</p>
  {% endif %}
</section>

<details id="archive-and-shelved" class="archive-disclosure" data-reveal>
  <summary>Archive and shelved work</summary>
  <p>Older work and shelved ideas.</p>
  {% if archive_projects and archive_projects.size > 0 %}
    <div class="project-grid project-grid--secondary" data-disclosure-group>
      {% for project in archive_projects %}
        {% include project-card.html project=project %}
      {% endfor %}
    </div>
  {% else %}
    <p>No archive entries are currently published.</p>
  {% endif %}
</details>
