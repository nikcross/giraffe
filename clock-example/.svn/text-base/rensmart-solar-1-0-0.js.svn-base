SOLAR_ORIENTATION_FACTOR = [
[	0.86,	0.86,	0.86,	0.86,	0.86,	0.86,	0.86,	0.86	],//	0	Horizontal
[	0.91,	0.89,	0.84,	0.78,	0.76,	0.78,	0.84,	0.89	],//	15
[	0.97,	0.92,	0.82,	0.71,	0.66,	0.71,	0.82,	0.92	],//	30
[	0.95,	0.90,	0.82,	0.71,	0.57,	0.71,	0.82,	0.90	],//	45
[	0.89,	0.83,	0.70,	0.53,	0.45,	0.53,	0.70,	0.83	],//	60
[	0.78,	0.73,	0.61,	0.47,	0.39,	0.47,	0.61,	0.93	],//	75
[	0.67,	0.63,	0.53,	0.40,	0.34,	0.40,	0.53,	0.63	],//	90	Vertical
];

function CECB()
{
  this.SOLAR_PV = "SolarPV";
  this.WIND = "Wind";

  this.solarTable = new Array();
  this.windTable = new Array();

  this.Tariff = function(minPower,maxPower,tariffs)
  {
    this.minPower=minPower;
    this.maxPower=maxPower;
    this.tariffs=tariffs;
  }

  this.solarTable[0] = new this.Tariff(0,4,[41.3,41.3,37.8,34.6,31.6,28.8,26.2,23.8,21.7,19.7,18]);
  this.solarTable[1] = new this.Tariff(4,10,[36.1,36.1,33,30.2,27.6,25.1,22.9,20.8,19,17.2,15.7]);
  this.solarTable[2] = new this.Tariff(10,100,[31.4,31.4,28.7,26.3,24,21.9,19.9,18.1,16.5,15,13.6]);
  this.solarTable[3] = new this.Tariff(100,5000,[29.3,29.3,26.8,24.5,22.4,20.4,18.6,16.9,15.4,14,12.7]);

  this.windTable[0] = new this.Tariff(0,1.5,[34.5,34.5,32.6,30.8,29.1,27.5,26,24.6,23.2,21.9,20.7]);
  this.windTable[1] = new this.Tariff(1.5,15,[26.7,26.7,25.5,24.3,23.2,22.2,21.2,20.2,19.3,18.4,17.6]);
  this.windTable[2] = new this.Tariff(15,100,[24.1,24.1,23,21.9,20.9,20,19.1,18.2,17.4,16.6,15.9]);
  this.windTable[3] = new this.Tariff(100,500,[18.8,18.8,18.8,18.8,18.8,18.8,18.8,18.8,18.8,18.8,18.8]);
  this.windTable[4] = new this.Tariff(500,1500,[9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4]);
  this.windTable[5] = new this.Tariff(1500,5000,[4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5]);

  this.getPrice = function(technology,date,capacity)
  {
    financialYear = date.getFullYear();
    month = date.getMonth();

    if(month<2)
    {
      financialYear-=1;
    }

    if(financialYear<2010 || financialYear>2020) // CECB only available from 2010 and value only given until 2020
    {
      return 0;
    }

  table = null;
  if(technology==this.SOLAR_PV)
  {
    table = this.solarTable;
  }
  else if(technology==this.WIND)
  {
    table = this.windTable;
  }
  else // only calculating for wind and solar
  {
    return 0;
  }

  tariff = table[0];
  for(loop=0;loop<table.length;loop++)
  {
    if( (capacity/1000) > table[loop].minPower && (capacity/1000) <= table[loop].maxPower)
    {
      tariff=table[loop];
      break;
    }
  }

  return Math.round(tariff.tariffs[financialYear-2010]*100)/10000;
  }
}



		function getSolarPanelOrientationPowerFactor(direction,tilt)
		{
			direction = Math.round(direction);
			tilt = Math.round(tilt);
			direction = (direction%360)/45;
			tilt = tilt/15;

			if(tilt>=7) return 0;
			direction = Math.floor(direction);
			tilt = Math.floor(tilt);
			return SOLAR_ORIENTATION_FACTOR[tilt][direction];
		}

	function SolarData() {
		this.latitude=52;
		this.longitude=0;
		this.direction=0;
		this.tilt=0;
		this.panelArea=0;
		this.panelEfficiency=0.18;
		this.kWPeak=0;
		this.solarRadiation=1000;
		this.overshading=1;
		this.inverterLosses=0.20;
		this.generatedYearly=0;
		this.exported=0.5;
		this.importTariff=0.13;
		this.exportTariff=0.31;
		this.fitTariff=0.10;
		this.generatedYearly=0;
		this.co2PerkWh=0.568;
		this.co2Reduction=0;
		this.fitValue=0;
		this.savedByGeneration=0;
		this.exportValue=0;
	}

	function calculateSolarEstimate(solarData) {
	
		solarData.kWPeak = solarData.panelArea*solarData.panelEfficiency;
		cecb = new CECB();
		solarData.fitTariff=cecb.getPrice(cecb.SOLAR_PV,new Date(),solarData.kWPeak);
		this.solarRadiation=lookUpSolarEnergy(solarData.latitude,solarData.longitude);
	
		panelOrientationPowerFactor = getSolarPanelOrientationPowerFactor(
			solarData.direction,solarData.tilt
		);
		
		solarData.generatedYearly =  
			solarData.kWPeak*
			solarData.solarRadiation*
			solarData.overshading*
			panelOrientationPowerFactor *
			(1-solarData.inverterLosses);

		solarData.savedByGeneration = 
			solarData.generatedYearly*
			solarData.fitTariff*
			(1-solarData.exported);

		solarData.fitValue = solarData.fitTariff * solarData.generatedYearly;
		
		solarData.exportValue = 
			solarData.generatedYearly*
			solarData.exportTariff*
			solarData.exported;

		totalValue = 
			solarData.exportValue+
			solarData.savedByGeneration+
			solarData.fitValue;
		
		solarData.co2Reduction = 
			solarData.co2PerkWh*solarData.generatedYearly;
	}
	
	function lookUpSolarEnergy(latitude,longitude) {
	  data=ajax.doGet(
	  	"http://www.rensmart.com/DataServices/REST","service=getPVGISSolar&latitude="+latitude+"&longitude="+longitude
	  );
	  dailyPower=eval("("+data+")").power;
	  return dailyPower*365;
	}