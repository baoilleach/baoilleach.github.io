#include <Helium/diagram.h>
#include <Helium/hemol.h>
#include <Helium/smiles.h>
#include <Helium/fileio/moleculefile.h>
#include <Helium/algorithms/cycles.h>
#include <Helium/algorithms/kekulize.h>
#include <Helium/depict/svgpainter.h>
#include <Helium/depict/depict.h>
#include <iostream>

using namespace Helium;

extern "C"
 {
    int ValidateSmiles(const char* smiles, void* mbuf, unsigned int buflen)
    {
            char* dst = (char*)mbuf;

            Smiles smilesparser;
            HeMol mol;
            int success = smilesparser.read(smiles, mol);
            if (success)
              return 0;

            Error err = smilesparser.error();
            const char* src = err.what().c_str();
            int i;
            for(i=0; i+1<buflen && *src!='\0'; i++)
              *dst++ = *src++;
            *dst ='\0';

            return i;
    }

    int SmilesToSVG(const char* smiles, void* mbuf, unsigned int buflen)
    {
            char* dst = (char*)mbuf;

            Smiles smilesparser;
            HeMol mol;
            int success = smilesparser.read(smiles, mol);
            if (!success) return -1;

            kekulize(mol);
            std::vector<std::pair<double, double> > coords = generate_diagram(mol);

            // generate the depiction
            std::ostringstream ss;
            SVGPainter painter(ss);
            Depict depict(&painter);
            depict.setOption(Depict::AromaticCircle);
            depict.setPenWidth(2);
            depict.drawMolecule(mol, relevant_cycles(mol), coords);

            std::string result = ss.str(); // Copies it :-/
            if (result.size()+1 >= buflen)
                return -1;

            strcpy(dst, result.c_str());
            return result.size();
    }
}

int main()
{
  // create a molecule
  HeMol mol;

  // read a SMILES string
  Smiles SMILES;
  if (!SMILES.read("c1ccccc1O", mol)) {
    return -1;
  }

  // generate 2D coordinates
  kekulize(mol);
  std::vector<std::pair<double, double> > coords = generate_diagram(mol);

  // generate the depiction
  SVGPainter painter(std::cout);
  Depict depict(&painter);
  depict.setOption(Depict::AromaticCircle);
  depict.setPenWidth(2);
  depict.drawMolecule(mol, relevant_cycles(mol), coords);
}
