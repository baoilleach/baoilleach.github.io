# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <markdowncell>

# mesh20x20 FiPy example implemented as an IPython notebook
# =========================================================
# 
# This examples solves a two-dimensional diffusion problem in a square domain and demonstrates the use of applying boundary condition patches.
# 
# (Taken from http://www.ctcms.nist.gov/fipy/examples/diffusion/generated/examples.diffusion.mesh20x20.html)

# <codecell>

from IPython.display import clear_output
import time

# <codecell>

from fipy import *

# <codecell>

nx = 20
ny = nx
dx = 1.
dy = dx
L = dx * nx
mesh = Grid2D(dx=dx, dy=dy, nx=nx, ny=ny)

# <markdowncell>

# We create a [CellVariable](http://www.ctcms.nist.gov/fipy/fipy/generated/fipy.variables.html#fipy.variables.cellVariable.CellVariable) and initialize it to zero:

# <codecell>

phi = CellVariable(name = "solution variable",
                   mesh = mesh,
                   value = 0.)

# <markdowncell>

# and then create a diffusion equation. This is solved by default with an iterative conjugate gradient solver.

# <codecell>

D = 1.
eq = TransientTerm() == DiffusionTerm(coeff=D)

# <markdowncell>

# We apply Dirichlet boundary conditions

# <codecell>

valueTopLeft = 0
valueBottomRight = 1

# <markdowncell>

# to the top-left and bottom-right corners. Neumann boundary conditions are automatically applied to the top-right and bottom-left corners.

# <codecell>

X, Y = mesh.faceCenters
facesTopLeft = ((mesh.facesLeft & (Y > L / 2))
                | (mesh.facesTop & (X < L / 2)))
facesBottomRight = ((mesh.facesRight & (Y < L / 2))
                    | (mesh.facesBottom & (X > L / 2)))

# <codecell>

phi.constrain(valueTopLeft, facesTopLeft)
phi.constrain(valueBottomRight, facesBottomRight)

# <markdowncell>

# We create a viewer to see the results

# <codecell>

viewer = Viewer(vars=phi, datamin=0., datamax=1.)

# <markdowncell>

# and solve the equation by repeatedly looping in time:

# <codecell>

timeStepDuration = 10 * 0.9 * dx**2 / (2 * D)
steps = 10
for step in range(steps):
    eq.solve(var=phi,
             dt=timeStepDuration)
    viewer.axes.set_title("Solution variable (Step %d)" % (step + 1,))
    viewer.plot()
    time.sleep(1)
    clear_output()
    display(viewer.axes.get_figure())

# <markdowncell>

# We can also solve the steady-state problem directly

# <codecell>

DiffusionTerm().solve(var=phi)
viewer.plot()
viewer.axes.set_title("Solution variable (steady state)")
display(viewer.axes.get_figure())

# <codecell>


