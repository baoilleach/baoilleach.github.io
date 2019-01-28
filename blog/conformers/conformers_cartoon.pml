## JP script to generate realistic looking conformers

#load /home/jp/share/Dropbox/inhibox/projects/conformer_generation/paper_jacs_chem_inf/cover/confab_conformers.sdf
set all_states, on
show sticks

set_color oxygen, [1.0,0.4,0.4]
set_color nitrogen, [0.5,0.5,1.0]
util.cbaw

bg white
unset depth_cue

set ray_trace_mode, 3
set field_of_view, 30
set antialias, 2
# zoom complete=1
zoom center, 4.75

ray renderer=1
ray 300,300
png /home/jp/tmp/conformer_cartoon, dpi=300


set all_states, on
show sticks

set_color oxygen, [1.0,0.4,0.4]
set_color nitrogen, [0.5,0.5,1.0]
util.cbaw

bg white

set light_count,10
set spec_count,1
set shininess, 10
set specular, 0.25
set ambient,0
set direct,0
set reflect,1.5
set ray_shadow_decay_factor, 0.1
set ray_shadow_decay_range, 2
unset depth_cue

set field_of_view, 20
set antialias, 2
# zoom complete=1
zoom center, 4.75

ray renderer=1
ray 3000,3000
png /home/jp/tmp/conformer_real, dpi=300

