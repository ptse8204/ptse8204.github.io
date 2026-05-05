---
layout: page
title: Projects
subtitle: "Case notes for the work behind the resume: messy inputs, clearer systems, and more dependable decisions."
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
  <p class="section-kicker">How to scan</p>
  <h2>Each note answers three recruiter questions.</h2>
  <p>
    What was unclear or brittle? What system or workflow changed? What became easier for the people using it? Open a card when you want the short version behind a resume line.
  </p>
</article>

<section id="featured-work" class="project-section project-section--featured">
  <div class="section-heading section-heading--split" data-reveal>
    <p class="section-kicker">Featured work</p>
    <h2>The clearest examples of my data systems work.</h2>
    <p>Start here for customer identity, ELT reliability, product measurement, fairness review, and transportation analysis.</p>
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
    <h2>More systems and workflow builds</h2>
    <p>Additional examples with the same pattern: make the work clearer, easier to maintain, and easier to use.</p>
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
    <p>Domain work that explains why I care about infrastructure, access, measurement, and practical trade-offs.</p>
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
