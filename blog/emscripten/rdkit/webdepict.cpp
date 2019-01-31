#include <RDGeneral/RDLog.h>
#include <GraphMol/RDKitBase.h>
#include <GraphMol/MolDrawing/MolDrawing.h>
#include <GraphMol/SmilesParse/SmilesParse.h>
#include <GraphMol/MolDrawing/DrawingToSVG.h>

extern "C" 
{

  int SmilesToSVG(const char* smiles, void* mbuf, unsigned int buflen)
  {

    RDKit::RWMol *mol = (RDKit::RWMol*)0;
    try {
      rdErrorLog->df_enabled = false; // Do not report SMILES parsing errors
      mol = RDKit::SmilesToMol(smiles);
    }
    catch (...) { // RDKit::MolSanitizeException and friends
      mol = (RDKit::RWMol*)0;
    }

    std::string svg = "";
    if(mol!=NULL) {
      // RDDepict::compute2DCoords(*mol);
      std::vector<int> drawing = RDKit::Drawing::MolToDrawing(*mol);
      svg = RDKit::Drawing::DrawingToSVG(drawing, 4);

      delete mol;
    }
    if (svg.size()+1 >= buflen)
        return -1;

    char* dst = (char*)mbuf;
    strcpy(dst, svg.c_str());
    return svg.size();
  }
}


int  main()
{
  const char* smiles = "CC(=O)Cl";
  RDKit::RWMol *mol = (RDKit::RWMol*)0;
  try {
    rdErrorLog->df_enabled = false; // Do not report SMILES parsing errors
    mol = RDKit::SmilesToMol(smiles);
  }
  catch (...) { // RDKit::MolSanitizeException and friends
    mol = (RDKit::RWMol*)0;
  }

  std::string svg = "";
  if(mol!=NULL) {
    std::vector<int> drawing = RDKit::Drawing::MolToDrawing(*mol);
    svg = RDKit::Drawing::DrawingToSVG(drawing);

    delete mol;
  }
  printf("%s\n", svg.c_str());

  return 1;
}
