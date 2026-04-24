---
layout: page
title: Projects
subtitle: "A selection of projects that show the kind of work I do most often: make something clearer, more reliable, and easier for another person to use."
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
{% assign more_builds_count = work_relevant_projects.size | plus: fun_projects.size %}

<article class="surface-card surface-card--summary" data-reveal>
  <p class="section-kicker">How to read this page</p>
  <h2>These are case notes, not thumbnails.</h2>
  <p>
    Each project opens into a short note on the problem, what was built, and what changed. The page is meant to stay easy to scan before it asks for more attention.
  </p>
</article>

<section id="featured-work" class="project-section project-section--featured">
  <div class="section-heading section-heading--split" data-reveal>
    <p class="section-kicker">Featured work</p>
    <h2>The fastest way to understand how I work.</h2>
    <p>Start here for the clearest read on the problems I take on and the kind of systems I tend to leave behind.</p>
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
    <h2>More builds</h2>
    <p>More systems and smaller builds that show the same preference for useful outputs and clear handoffs.</p>
  </div>
  {% if more_builds_count > 0 %}
    <div class="project-grid project-grid--secondary" data-disclosure-group>
      {% for project in work_relevant_projects %}
        {% include project-card.html project=project %}
      {% endfor %}
      {% for project in fun_projects %}
        {% include project-card.html project=project %}
      {% endfor %}
    </div>
  {% else %}
    <p data-reveal>Additional builds will appear here once they are ready to surface.</p>
  {% endif %}
</section>

<section id="transportation-and-domain-work" class="project-section project-section--domain">
  <div class="section-heading" data-reveal>
    <h2>Transportation and planning</h2>
    <p>Work that shows the wider context behind the rest of the portfolio.</p>
  </div>
  {% if domain_projects and domain_projects.size > 0 %}
    <div class="project-grid project-grid--secondary" data-disclosure-group>
      {% for project in domain_projects %}
        {% include project-card.html project=project %}
      {% endfor %}
    </div>
  {% else %}
    <p data-reveal>Domain work will appear here when there is something worth keeping live.</p>
  {% endif %}
</section>

<details id="archive-and-shelved" class="archive-disclosure" data-reveal>
  <summary>Archive and shelved work</summary>
  <p>Older work that still says something useful about judgment, constraints, or where a project stopped.</p>
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
