class CarValidator {
  static carSchema = {
    make: {
      escape: true,
      notEmpty: {
        errorMessage: "Марка не може бути пустою",
      },
    },
    model: {
      escape: true,
      notEmpty: {
        errorMessage: "Модель не може бути пустою",
      },
    },
    year: {
      escape: true,
      isInt: {
        options: { min: 1950, max: new Date().getFullYear() + 1 },
        errorMessage: `Рік має бути від 1950 до ${
          new Date().getFullYear() + 1
        }`,
      },
      notEmpty: {
        errorMessage: "Рік не може бути пустим",
      },
    },
    numberPlate: {
      escape: true,
      trim: true,
      matches: {
        options: /^[A-Z]{2}\d{4}[A-Z]{2}$/,
        errorMessage: "Номерний знак не відповідає вимогам XX1234XX",
      },
      notEmpty: {
        errorMessage: "Номерний знак не може бути пустим",
      },
    },
  };
}

export default CarValidator;
